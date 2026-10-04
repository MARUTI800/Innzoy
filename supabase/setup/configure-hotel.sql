-- FIRST HOTEL SETUP TEMPLATE. This is not a migration and is never run automatically.
-- Fill only verified operating data. Empty defaults deliberately fail before any writes.
-- Guests select a hotel; room units below are private capacity accounting.
begin;
do $$
declare
  hotel_id text := '';             -- khajaguda | dlf-road | tngo-colony | hitec-city
  verified_units jsonb := '[]';    -- Real units: [{"label":"REAL_INTERNAL_LABEL","max_guests":REAL_INTEGER}]
  accepted_arrivals text[] := '{}'; -- Exact accepted local arrival times, each HH:MM.
  unit jsonb;
begin
  if hotel_id is null or hotel_id not in ('khajaguda', 'dlf-road', 'tngo-colony', 'hitec-city') then
    raise exception 'Fill hotel_id with the verified first hotel before running this template';
  end if;
  if not exists (select 1 from public.booking_properties where id = hotel_id and not booking_enabled) then
    raise exception 'Hotel must exist and remain disabled during initial inventory setup';
  end if;
  if jsonb_typeof(verified_units) is distinct from 'array' or jsonb_array_length(verified_units) = 0 then
    raise exception 'Supply the actual independently reservable room units and occupancy limits';
  end if;
  if exists (select 1 from jsonb_array_elements(verified_units) r
    where jsonb_typeof(r->'label') is distinct from 'string' or length(trim(r->>'label')) not between 1 and 120
      or jsonb_typeof(r->'max_guests') is distinct from 'number' or r->>'max_guests' !~ '^([1-9]|1[0-2])$') then
    raise exception 'Each real unit requires a unique internal label and integer max_guests between 1 and 12';
  end if;
  if (select count(*) from jsonb_array_elements(verified_units)) <>
    (select count(distinct trim(r->>'label')) from jsonb_array_elements(verified_units) r) then
    raise exception 'Room labels must be unique; count each real sellable unit exactly once';
  end if;
  if coalesce(cardinality(accepted_arrivals), 0) = 0 or exists (select 1 from unnest(accepted_arrivals) t
    where t is null or t !~ '^([01][0-9]|2[0-3]):[0-5][0-9]$') then
    raise exception 'Supply actual accepted arrival times in local Hyderabad HH:MM format';
  end if;
  if cardinality(accepted_arrivals) <> (select count(distinct t) from unnest(accepted_arrivals) t) then
    raise exception 'Accepted arrival times must be unique';
  end if;
  if exists (select 1 from public.booking_room_units where property_id = hotel_id)
    or exists (select 1 from public.booking_arrival_slots where property_id = hotel_id) then
    raise exception 'This hotel already has inventory or arrival slots; review existing rows instead of rerunning initial setup';
  end if;

  -- All input guards above run before mutation. This transaction leaves the hotel DISABLED.
  for unit in select * from jsonb_array_elements(verified_units) loop
    insert into public.booking_room_units(property_id, label, max_guests, active)
      values (hotel_id, trim(unit->>'label'), (unit->>'max_guests')::smallint, true);
  end loop;
  insert into public.booking_arrival_slots(property_id, arrival_time, enabled)
    select hotel_id, t::time, true from unnest(accepted_arrivals) t;
end;
$$;
commit;

-- Next: reconcile offline/existing reservations against these units while the hotel stays
-- disabled. Review the confirmed check-in/check-out policy, then use enable-hotel.sql.
-- Do not populate public room names/photos: individual room selection is deferred.
