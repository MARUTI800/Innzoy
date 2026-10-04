-- Optional room selection. Apply after 202610020001_booking.sql.
-- No room records, photos, room types, capacity, or rates are invented here.
begin;

alter table public.booking_room_units
  add column public_name text,
  add column public_description text not null default '',
  add column public_images text[] not null default '{}',
  add column show_in_booking boolean not null default false,
  add constraint booking_room_public_name_length check (public_name is null or length(public_name) <= 120),
  add constraint booking_room_public_description_length check (length(public_description) <= 1500),
  add constraint booking_room_public_image_limit check (cardinality(public_images) <= 12),
  add constraint booking_room_publish_requires_metadata check (
    not show_in_booking or (public_name is not null and length(trim(public_name)) > 0 and cardinality(public_images) > 0)
  );

-- Distinguish a guest's public choice from the hotel's private automatic assignment.
alter table public.bookings
  add column requested_room_unit_id uuid,
  add constraint bookings_honor_requested_room check (requested_room_unit_id is null or requested_room_unit_id = room_unit_id);

create or replace function public.booking_safe_json(p_booking public.bookings)
returns jsonb language sql stable set search_path = '' as $$
  select jsonb_strip_nulls(jsonb_build_object(
    'id', p_booking.id, 'booking_reference', p_booking.booking_reference,
    'property_id', p_booking.property_id, 'check_in', p_booking.check_in,
    'check_out', p_booking.check_out, 'arrival_time', to_char(date '2000-01-01' + p_booking.arrival_time, 'HH24:MI'),
    'guests', p_booking.guests, 'first_name', p_booking.first_name,
    'last_name', p_booking.last_name, 'email', p_booking.email, 'phone', p_booking.phone,
    'notes', p_booking.notes, 'status', p_booking.status, 'created_at', p_booking.created_at,
    'room_unit_id', p_booking.requested_room_unit_id
  ));
$$;

create or replace function public.booking_availability(
  p_property_id text, p_month date, p_guests integer,
  p_check_in date default null, p_check_out date default null
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_now timestamp := clock_timestamp() at time zone 'Asia/Kolkata';
  v_today date := v_now::date;
  v_max date := v_today + 365;
  v_dates jsonb;
  v_slots jsonb := '[]'::jsonb;
  v_rooms jsonb := '[]'::jsonb;
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
    -- Only operators' explicitly published, photographed rooms are presented to guests.
    -- Public availability never exposes internal labels or other guests' bookings.
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', u.id, 'name', trim(u.public_name), 'description', u.public_description,
      'images', u.public_images, 'max_guests', u.max_guests,
      'available', (p_check_in > v_today or v_future_arrival) and not exists (
        select 1 from public.bookings b where b.room_unit_id = u.id
        and b.status in ('pending', 'confirmed')
        and daterange(b.check_in, b.check_out, '[)') && daterange(p_check_in, p_check_out, '[)')
      )
    ) order by u.public_name, u.id), '[]'::jsonb) into v_rooms
      from public.booking_room_units u
      where u.property_id = p_property_id and u.active and u.max_guests >= p_guests
      and u.show_in_booking and length(trim(u.public_name)) > 0 and u.public_name !~ '[[:cntrl:]]'
      and exists (select 1 from unnest(u.public_images) image
        where length(image) <= 2048 and image ~ '^https?://[^/@[:space:]]+(/|$)' and image !~ '[[:cntrl:]]');
  end if;
  return jsonb_build_object('dates', v_dates, 'slots', v_slots, 'available', v_stay, 'room_options', v_rooms);
end;
$$;

-- Replace the old RPC rather than creating ambiguous PostgREST overloads.
-- Its appended default parameter preserves existing calls that omit a room choice.
drop function public.create_booking(text, date, date, time, integer, text, text, text, text, text, text, text, text);
create function public.create_booking(
  p_property_id text, p_check_in date, p_check_out date, p_arrival_time time, p_guests integer,
  p_first_name text, p_last_name text, p_email text, p_phone text, p_notes text,
  p_idempotency_hash text, p_request_hash text, p_access_hash text,
  p_room_unit_id uuid default null
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
  perform pg_advisory_xact_lock(hashtextextended(p_idempotency_hash, 0));
  select * into v_booking from public.bookings where idempotency_hash = p_idempotency_hash;
  if found then
    if v_booking.request_hash <> p_request_hash or v_booking.access_token_hash <> p_access_hash
      or v_booking.requested_room_unit_id is distinct from p_room_unit_id then
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
  -- The property lock and exclusion constraint protect every allocation, selected or automatic.
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
    and (p_room_unit_id is null or (u.id = p_room_unit_id and u.show_in_booking
      and length(trim(u.public_name)) > 0 and u.public_name !~ '[[:cntrl:]]' and exists (select 1 from unnest(u.public_images) image
        where length(image) <= 2048 and image ~ '^https?://[^/@[:space:]]+(/|$)' and image !~ '[[:cntrl:]]')))
    and not exists (select 1 from public.bookings b where b.room_unit_id = u.id
      and b.status in ('pending', 'confirmed')
      and daterange(b.check_in, b.check_out, '[)') && daterange(p_check_in, p_check_out, '[)'))
    order by u.max_guests, u.label, u.id limit 1 for update of u;
  if v_unit is null then raise exception using errcode = 'P0001', message = 'BOOKING_CONFLICT'; end if;
  insert into public.bookings(property_id, room_unit_id, requested_room_unit_id, check_in, check_out, arrival_time, guests,
    first_name, last_name, email, phone, notes, idempotency_hash, request_hash, access_token_hash)
    values (p_property_id, v_unit, p_room_unit_id, p_check_in, p_check_out, p_arrival_time, p_guests,
      trim(p_first_name), trim(p_last_name), lower(trim(p_email)), trim(p_phone), trim(p_notes),
      p_idempotency_hash, p_request_hash, p_access_hash) returning * into v_booking;
  return public.booking_safe_json(v_booking);
end;
$$;

revoke all on function public.create_booking(text, date, date, time, integer, text, text, text, text, text, text, text, text, uuid) from public, anon, authenticated;
grant execute on function public.create_booking(text, date, date, time, integer, text, text, text, text, text, text, text, text, uuid) to service_role;
notify pgrst, 'reload schema';
commit;
