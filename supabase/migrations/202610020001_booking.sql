-- Apply once through Supabase migrations or the SQL editor. No inventory is invented.
begin;
create extension if not exists btree_gist;

create table public.booking_properties (
  id text primary key,
  name text not null,
  booking_enabled boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.booking_room_units (
  id uuid primary key default gen_random_uuid(),
  property_id text not null references public.booking_properties(id),
  label text not null,
  max_guests smallint not null check (max_guests between 1 and 12),
  active boolean not null default false,
  unique (property_id, label),
  unique (id, property_id)
);
create table public.booking_arrival_slots (
  property_id text not null references public.booking_properties(id),
  arrival_time time not null check (arrival_time < time '24:00' and extract(second from arrival_time) = 0),
  enabled boolean not null default false,
  primary key (property_id, arrival_time)
);
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_reference text not null unique default ('INZ-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 20))),
  property_id text not null references public.booking_properties(id),
  room_unit_id uuid not null,
  check_in date not null,
  check_out date not null,
  arrival_time time not null check (arrival_time < time '24:00' and extract(second from arrival_time) = 0),
  guests smallint not null check (guests between 1 and 12),
  first_name text not null check (length(first_name) between 1 and 80),
  last_name text not null check (length(last_name) between 1 and 80),
  email text not null check (length(email) between 3 and 254),
  phone text not null check (length(phone) between 7 and 30),
  notes text not null default '' check (length(notes) <= 1500),
  status text not null default 'confirmed' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  idempotency_hash text not null unique check (idempotency_hash ~ '^[a-f0-9]{64}$'),
  request_hash text not null check (request_hash ~ '^[a-f0-9]{64}$'),
  access_token_hash text not null check (access_token_hash ~ '^[a-f0-9]{64}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (room_unit_id, property_id) references public.booking_room_units(id, property_id),
  check (check_out > check_in and check_out - check_in <= 30),
  constraint bookings_no_overlapping_nights exclude using gist (
    room_unit_id with =,
    daterange(check_in, check_out, '[)') with &&
  ) where (status in ('pending', 'confirmed'))
);
create index bookings_upcoming on public.bookings(property_id, check_in, status);
create index bookings_customer_email on public.bookings(lower(email));
create index booking_units_capacity on public.booking_room_units(property_id, max_guests) where active;

alter table public.booking_properties enable row level security;
alter table public.booking_room_units enable row level security;
alter table public.booking_arrival_slots enable row level security;
alter table public.bookings enable row level security;
-- No anon/authenticated policies: even possession of a reference cannot expose PII.
revoke all on public.booking_properties, public.booking_room_units, public.booking_arrival_slots, public.bookings from public, anon, authenticated;
grant all on public.booking_properties, public.booking_room_units, public.booking_arrival_slots, public.bookings to service_role;

insert into public.booking_properties(id, name) values
  ('khajaguda', 'Khajaguda'), ('dlf-road', 'DLF Road'), ('tngo-colony', 'TNGO Colony'),
  ('hitec-city', 'HITEC City'), ('jubilee-hills', 'Jubilee Hills'), ('manikonda', 'Manikonda'),
  ('kondapur', 'Kondapur'), ('gopanpally', 'Gopanpally'), ('mokila', 'Mokila');

create function public.booking_safe_json(p_booking public.bookings)
returns jsonb language sql stable set search_path = '' as $$
  select jsonb_build_object(
    'id', p_booking.id, 'booking_reference', p_booking.booking_reference,
    'property_id', p_booking.property_id, 'check_in', p_booking.check_in,
    'check_out', p_booking.check_out, 'arrival_time', to_char(date '2000-01-01' + p_booking.arrival_time, 'HH24:MI'),
    'guests', p_booking.guests, 'first_name', p_booking.first_name,
    'last_name', p_booking.last_name, 'email', p_booking.email, 'phone', p_booking.phone,
    'notes', p_booking.notes, 'status', p_booking.status, 'created_at', p_booking.created_at
  );
$$;

create function public.booking_availability(
  p_property_id text, p_month date, p_guests integer,
  p_check_in date default null, p_check_out date default null
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_now timestamp := clock_timestamp() at time zone 'Asia/Kolkata';
  v_today date := v_now::date;
  v_max date := v_today + 365;
  v_dates jsonb;
  v_slots jsonb := '[]'::jsonb;
  v_stay boolean := false;
  v_future_arrival boolean;
begin
  if p_property_id is null or p_guests is null or p_guests not between 1 and 12
    or p_month is null or extract(day from p_month) <> 1
    or p_month < date_trunc('month', v_today)::date or p_month > date_trunc('month', v_max)::date
    or ((p_check_in is null) <> (p_check_out is null)) then
    raise exception using errcode = 'P0001', message = 'BOOKING_VALIDATION_ERROR';
  end if;
  if p_check_in is not null and (p_check_in < v_today or p_check_in >= v_max
    or p_check_out > v_max or p_check_out <= p_check_in or p_check_out - p_check_in > 30) then
    raise exception using errcode = 'P0001', message = 'BOOKING_VALIDATION_ERROR';
  end if;
  if not exists (select 1 from public.booking_properties where id = p_property_id and booking_enabled)
    or not exists (select 1 from public.booking_room_units where property_id = p_property_id and active)
    or not exists (select 1 from public.booking_arrival_slots where property_id = p_property_id and enabled) then
    raise exception using errcode = 'P0001', message = 'BOOKING_UNAVAILABLE';
  end if;
  select exists (select 1 from public.booking_arrival_slots
    where property_id = p_property_id and enabled and arrival_time > v_now::time) into v_future_arrival;
  select coalesce(jsonb_agg(jsonb_build_object('date', d, 'available',
    d >= v_today and d < v_max and (d > v_today or v_future_arrival) and exists (
      select 1 from public.booking_room_units u where u.property_id = p_property_id
      and u.active and u.max_guests >= p_guests and not exists (
        select 1 from public.bookings b where b.room_unit_id = u.id
        and b.status in ('pending', 'confirmed')
        and daterange(b.check_in, b.check_out, '[)') && daterange(d, d + 1, '[)')
      )
    )) order by d), '[]'::jsonb) into v_dates
    from (select p_month + n as d from generate_series(0,
      ((p_month + interval '1 month')::date - p_month) - 1) as n) days;
  if p_check_in is not null then
    select exists (select 1 from public.booking_room_units u
      where u.property_id = p_property_id and u.active and u.max_guests >= p_guests
      and not exists (select 1 from public.bookings b where b.room_unit_id = u.id
        and b.status in ('pending', 'confirmed')
        and daterange(b.check_in, b.check_out, '[)') && daterange(p_check_in, p_check_out, '[)')))
      into v_stay;
    select coalesce(jsonb_agg(jsonb_build_object('time', to_char(date '2000-01-01' + arrival_time, 'HH24:MI'),
      'available', v_stay and (p_check_in > v_today or arrival_time > v_now::time)) order by arrival_time), '[]'::jsonb)
      into v_slots from public.booking_arrival_slots where property_id = p_property_id and enabled;
    v_stay := v_stay and (p_check_in > v_today or v_future_arrival);
  end if;
  return jsonb_build_object('dates', v_dates, 'slots', v_slots, 'available', v_stay);
end;
$$;

create function public.create_booking(
  p_property_id text, p_check_in date, p_check_out date, p_arrival_time time, p_guests integer,
  p_first_name text, p_last_name text, p_email text, p_phone text, p_notes text,
  p_idempotency_hash text, p_request_hash text, p_access_hash text
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_now timestamp := clock_timestamp() at time zone 'Asia/Kolkata';
  v_unit uuid;
  v_booking public.bookings;
  v_enabled boolean;
begin
  if p_idempotency_hash is null or p_idempotency_hash !~ '^[a-f0-9]{64}$'
    or p_request_hash is null or p_request_hash !~ '^[a-f0-9]{64}$'
    or p_access_hash is null or p_access_hash !~ '^[a-f0-9]{64}$' then
    raise exception using errcode = 'P0001', message = 'BOOKING_VALIDATION_ERROR';
  end if;
  -- Concurrent retries serialize before reading the unique key.
  perform pg_advisory_xact_lock(hashtextextended(p_idempotency_hash, 0));
  select * into v_booking from public.bookings where idempotency_hash = p_idempotency_hash;
  if found then
    if v_booking.request_hash <> p_request_hash or v_booking.access_token_hash <> p_access_hash then
      raise exception using errcode = 'P0001', message = 'IDEMPOTENCY_CONFLICT';
    end if;
    return public.booking_safe_json(v_booking);
  end if;
  if p_property_id is null or p_check_in is null or p_check_out is null or p_arrival_time is null
    or p_check_in < v_now::date or p_check_in >= v_now::date + 365
    or p_check_out <= p_check_in or p_check_out > v_now::date + 365 or p_check_out - p_check_in > 30
    or p_guests is null or p_guests not between 1 and 12 or p_arrival_time >= time '24:00' or extract(second from p_arrival_time) <> 0
    or p_first_name is null or length(trim(p_first_name)) not between 1 and 80
    or p_last_name is null or length(trim(p_last_name)) not between 1 and 80
    or p_email is null or length(p_email) > 254 or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    or p_phone is null or length(p_phone) not between 7 and 30
    or p_phone !~ '^\+?[0-9[:space:]().-]+$'
    or length(regexp_replace(p_phone, '[^0-9]', '', 'g')) not between 7 and 15
    or p_notes is null or length(p_notes) > 1500 then
    raise exception using errcode = 'P0001', message = 'BOOKING_VALIDATION_ERROR';
  end if;
  -- Serialize room allocation per property. The exclusion constraint also protects
  -- against overlapping writes from other connections or future admin tooling.
  select booking_enabled into v_enabled from public.booking_properties where id = p_property_id for update;
  if not found or not v_enabled
    or not exists (select 1 from public.booking_room_units where property_id = p_property_id and active)
    or not exists (select 1 from public.booking_arrival_slots where property_id = p_property_id and enabled) then
    raise exception using errcode = 'P0001', message = 'BOOKING_UNAVAILABLE';
  end if;
  v_now := clock_timestamp() at time zone 'Asia/Kolkata';
  if p_check_in < v_now::date or p_check_in >= v_now::date + 365 or p_check_out > v_now::date + 365 then
    raise exception using errcode = 'P0001', message = 'BOOKING_VALIDATION_ERROR';
  end if;
  if (p_check_in = v_now::date and p_arrival_time <= v_now::time)
    or not exists (select 1 from public.booking_arrival_slots
      where property_id = p_property_id and arrival_time = p_arrival_time and enabled) then
    raise exception using errcode = 'P0001', message = 'BOOKING_CONFLICT';
  end if;
  select u.id into v_unit from public.booking_room_units u
    where u.property_id = p_property_id and u.active and u.max_guests >= p_guests
    and not exists (select 1 from public.bookings b where b.room_unit_id = u.id
      and b.status in ('pending', 'confirmed')
      and daterange(b.check_in, b.check_out, '[)') && daterange(p_check_in, p_check_out, '[)'))
    order by u.max_guests, u.label, u.id limit 1 for update of u;
  if v_unit is null then raise exception using errcode = 'P0001', message = 'BOOKING_CONFLICT'; end if;
  insert into public.bookings(property_id, room_unit_id, check_in, check_out, arrival_time, guests,
    first_name, last_name, email, phone, notes, idempotency_hash, request_hash, access_token_hash)
    values (p_property_id, v_unit, p_check_in, p_check_out, p_arrival_time, p_guests,
      trim(p_first_name), trim(p_last_name), lower(trim(p_email)), trim(p_phone), trim(p_notes),
      p_idempotency_hash, p_request_hash, p_access_hash) returning * into v_booking;
  return public.booking_safe_json(v_booking);
end;
$$;

create function public.get_booking(p_reference text, p_access_hash text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_booking public.bookings;
begin
  select * into v_booking from public.bookings
    where booking_reference = p_reference and access_token_hash = p_access_hash;
  if not found then raise exception using errcode = 'P0001', message = 'BOOKING_NOT_FOUND'; end if;
  return public.booking_safe_json(v_booking);
end;
$$;

-- Postgres grants EXECUTE to PUBLIC by default; revoke every booking helper/RPC.
revoke all on function public.booking_safe_json(public.bookings) from public, anon, authenticated;
revoke all on function public.booking_availability(text, date, integer, date, date) from public, anon, authenticated;
revoke all on function public.create_booking(text, date, date, time, integer, text, text, text, text, text, text, text, text) from public, anon, authenticated;
revoke all on function public.get_booking(text, text) from public, anon, authenticated;
grant execute on function public.booking_safe_json(public.bookings) to service_role;
grant execute on function public.booking_availability(text, date, integer, date, date) to service_role;
grant execute on function public.create_booking(text, date, date, time, integer, text, text, text, text, text, text, text, text) to service_role;
grant execute on function public.get_booking(text, text) to service_role;
notify pgrst, 'reload schema';
commit;
