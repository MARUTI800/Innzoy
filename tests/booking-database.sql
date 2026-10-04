-- LOCAL DISPOSABLE DATABASE ONLY. Synthetic inventory and bookings roll back.
begin;
do $$
declare
  d date := (clock_timestamp() at time zone 'Asia/Kolkata')::date + 10;
  r jsonb;
  replay jsonb;
  availability jsonb;
  unit_id uuid;
  unit_b uuid;
  choice_a uuid;
  choice_b uuid;
  choice_hidden uuid;
  choice_small uuid;
  expected text;
begin
  if has_table_privilege('anon', 'public.bookings', 'SELECT')
    or has_table_privilege('authenticated', 'public.bookings', 'SELECT')
    or has_function_privilege('anon', 'public.create_booking(text,date,date,time,integer,text,text,text,text,text,text,text,text,uuid)', 'EXECUTE')
    or has_function_privilege('authenticated', 'public.create_booking(text,date,date,time,integer,text,text,text,text,text,text,text,text,uuid)', 'EXECUTE')
    or has_function_privilege('authenticated', 'public.get_booking(text,text)', 'EXECUTE') then
    raise exception 'Public role can access private booking data or RPC';
  end if;
  begin
    perform public.booking_availability('khajaguda', date_trunc('month', d)::date, 2);
    raise exception 'Unconfigured inventory was offered';
  exception when raise_exception then
    if sqlerrm <> 'BOOKING_UNAVAILABLE' then raise; end if;
  end;
  insert into public.booking_properties(id, name, booking_enabled) values ('booking-test', 'Synthetic local test only', true);
  insert into public.booking_room_units(property_id, label, max_guests, active)
    values ('booking-test', 'Synthetic test A', 2, true) returning id into unit_id;
  insert into public.booking_arrival_slots(property_id, arrival_time, enabled)
    values ('booking-test', '11:00', true), ('booking-test', '16:30', true);
  begin
    insert into public.booking_arrival_slots(property_id, arrival_time, enabled) values ('booking-test', '24:00', true);
    raise exception 'Unrepresentable 24:00 arrival slot accepted';
  exception when check_violation then null; end;
  r := public.create_booking('booking-test', d, d + 2, '11:00', 2,
    'Synthetic', 'Guest', 'synthetic@example.test', '+91 9999999999', '', repeat('a', 64), repeat('b', 64), repeat('c', 64));
  if r->>'status' <> 'confirmed' or r ? 'room_unit_id' or r ? 'access_token_hash' then raise exception 'Unsafe booking response'; end if;
  replay := public.create_booking('booking-test', d, d + 2, '11:00', 2,
    'Synthetic', 'Guest', 'synthetic@example.test', '+91 9999999999', '', repeat('a', 64), repeat('b', 64), repeat('c', 64));
  if r <> replay or (select count(*) from public.bookings where property_id = 'booking-test') <> 1 then raise exception 'Idempotent retry created another booking'; end if;
  begin
    perform public.create_booking('booking-test', d, d + 2, '11:00', 2,
      'Synthetic', 'Guest', 'synthetic@example.test', '+91 9999999999', 'changed', repeat('a', 64), repeat('d', 64), repeat('c', 64));
    raise exception 'Changed idempotent request was accepted';
  exception when raise_exception then if sqlerrm <> 'IDEMPOTENCY_CONFLICT' then raise; end if; end;
  begin
    perform public.create_booking('booking-test', d + 1, d + 3, '16:30', 2,
      'Synthetic', 'Guest', 'synthetic@example.test', '+91 9999999999', '', repeat('e', 64), repeat('f', 64), repeat('0', 64));
    raise exception 'Overlapping stay at another arrival time was accepted';
  exception when raise_exception then if sqlerrm <> 'BOOKING_CONFLICT' then raise; end if; end;
  availability := public.booking_availability('booking-test', date_trunc('month', d)::date, 2, d, d + 2);
  if (availability->>'available')::boolean or exists (select 1 from jsonb_array_elements(availability->'slots') s where (s->>'available')::boolean) then raise exception 'Booked nights remain available'; end if;
  replay := public.create_booking('booking-test', d + 2, d + 3, '11:00', 2,
    'Synthetic', 'Guest', 'synthetic@example.test', '+91 9999999999', '', repeat('1', 64), repeat('2', 64), repeat('3', 64));
  if replay->>'status' <> 'confirmed' then raise exception 'Adjacent checkout/check-in nights blocked'; end if;
  if public.get_booking(r->>'booking_reference', repeat('c', 64)) <> r then raise exception 'Authenticated lookup failed'; end if;
  begin
    perform public.get_booking(r->>'booking_reference', repeat('d', 64));
    raise exception 'Invalid token exposed a booking';
  exception when raise_exception then if sqlerrm <> 'BOOKING_NOT_FOUND' then raise; end if; end;
  availability := public.booking_availability('booking-test', date_trunc('month', d)::date, 3);
  if exists (select 1 from jsonb_array_elements(availability->'dates') x where (x->>'available')::boolean) then raise exception 'Dates ignore guest capacity'; end if;
  -- The constraint independently stops direct overlapping writes (future admin tools).
  begin
    insert into public.bookings(property_id, room_unit_id, check_in, check_out, arrival_time, guests,
      first_name, last_name, email, phone, idempotency_hash, request_hash, access_token_hash, status)
      values ('booking-test', unit_id, d, d + 1, '16:30', 2, 'Synthetic', 'Guest',
        'synthetic@example.test', '+91 9999999999', repeat('4', 64), repeat('5', 64), repeat('6', 64), 'pending');
    raise exception 'Direct overlapping pending insert bypassed exclusion constraint';
  exception when exclusion_violation then null; end;
  update public.bookings set status = 'cancelled' where id = (r->>'id')::uuid;
  replay := public.create_booking('booking-test', d, d + 1, '16:30', 2,
    'Synthetic', 'Guest', 'synthetic@example.test', '+91 9999999999', '', repeat('7', 64), repeat('8', 64), repeat('9', 64));
  if replay->>'status' <> 'confirmed' then raise exception 'Cancelled booking did not release nights'; end if;
  -- A free room on each night is insufficient: one unit must fit the whole stay.
  insert into public.booking_room_units(property_id, label, max_guests, active)
    values ('booking-test', 'Synthetic test B', 2, true) returning id into unit_b;
  insert into public.bookings(property_id, room_unit_id, check_in, check_out, arrival_time, guests,
    first_name, last_name, email, phone, idempotency_hash, request_hash, access_token_hash)
    values ('booking-test', unit_id, d + 5, d + 6, '11:00', 2, 'Synthetic', 'Guest',
      'synthetic@example.test', '+91 9999999999', repeat('0', 63) || '1', repeat('0', 63) || '2', repeat('0', 63) || '3'),
    ('booking-test', unit_b, d + 6, d + 7, '11:00', 2, 'Synthetic', 'Guest',
      'synthetic@example.test', '+91 9999999999', repeat('0', 63) || '4', repeat('0', 63) || '5', repeat('0', 63) || '6');
  availability := public.booking_availability('booking-test', date_trunc('month', d)::date, 2, d + 5, d + 7);
  if (availability->>'available')::boolean then raise exception 'Fragmented room availability accepted a full stay'; end if;
  if exists (select 1 from jsonb_array_elements(availability->'dates') x where (x->>'date')::date in (d + 5, d + 6) and not (x->>'available')::boolean) then raise exception 'One-night calendar availability incorrect'; end if;
  -- A committed old reservation is recoverable after its arrival date has passed.
  insert into public.bookings(property_id, room_unit_id, check_in, check_out, arrival_time, guests,
    first_name, last_name, email, phone, idempotency_hash, request_hash, access_token_hash)
    values ('booking-test', unit_id, d - 12, d - 11, '11:00', 2, 'Synthetic', 'Guest',
      'synthetic@example.test', '+91 9999999999', repeat('1', 63) || 'a', repeat('1', 63) || 'b', repeat('1', 63) || 'c')
    returning public.booking_safe_json(bookings) into r;
  replay := public.create_booking('booking-test', d - 12, d - 11, '11:00', 2,
    'Synthetic', 'Guest', 'synthetic@example.test', '+91 9999999999', '', repeat('1', 63) || 'a', repeat('1', 63) || 'b', repeat('1', 63) || 'c');
  if replay <> r then raise exception 'Old idempotent request did not recover its reservation'; end if;
  -- Explicit room choice uses real published metadata and still locks the full stay.
  insert into public.booking_properties(id, name, booking_enabled)
    values ('booking-choice-test', 'Synthetic room choice test only', true);
  insert into public.booking_room_units(property_id, label, max_guests, active, public_name, public_description, public_images, show_in_booking)
    values ('booking-choice-test', 'Internal A', 2, true, 'Published room A', 'Synthetic verified description', array['https://innzoy.test/room-a.jpg'], true)
    returning id into choice_a;
  insert into public.booking_room_units(property_id, label, max_guests, active, public_name, public_images, show_in_booking)
    values ('booking-choice-test', 'Internal B', 2, true, 'Published room B', array['https://innzoy.test/room-b.jpg'], true)
    returning id into choice_b;
  insert into public.booking_room_units(property_id, label, max_guests, active)
    values ('booking-choice-test', 'Unpublished internal room', 2, true) returning id into choice_hidden;
  insert into public.booking_room_units(property_id, label, max_guests, active, public_name, public_images, show_in_booking)
    values ('booking-choice-test', 'Internal small', 1, true, 'Single guest room', array['https://innzoy.test/single.jpg'], true)
    returning id into choice_small;
  insert into public.booking_arrival_slots(property_id, arrival_time, enabled)
    values ('booking-choice-test', '11:00', true);
  availability := public.booking_availability('booking-choice-test', date_trunc('month', d)::date, 2, d + 20, d + 22);
  if jsonb_array_length(availability->'room_options') <> 2 then raise exception 'Published room options ignored capacity or publication'; end if;
  if exists (select 1 from jsonb_array_elements(availability->'room_options') x
    where x ? 'label' or x ? 'property_id' or x ? 'access_token_hash'
    or x->>'id' not in (choice_a::text, choice_b::text)) then raise exception 'Internal room data exposed'; end if;
  availability := public.booking_availability('booking-choice-test', date_trunc('month', d)::date, 2);
  if jsonb_array_length(availability->'room_options') <> 0 then raise exception 'Room choices offered without stay dates'; end if;
  -- A room from another property, an unpublished unit, or inadequate capacity is rejected.
  foreach unit_b in array array[unit_id, choice_hidden, choice_small] loop
    begin
      perform public.create_booking('booking-choice-test', d + 20, d + 22, '11:00', 2,
        'Synthetic', 'Guest', 'synthetic@example.test', '+91 9999999999', '', repeat('2', 63) || 'a', repeat('2', 63) || 'b', repeat('2', 63) || 'c', unit_b);
      raise exception 'Invalid explicit room choice was accepted';
    exception when raise_exception then if sqlerrm <> 'BOOKING_CONFLICT' then raise; end if; end;
  end loop;
  r := public.create_booking('booking-choice-test', d + 20, d + 22, '11:00', 2,
    'Synthetic', 'Guest', 'synthetic@example.test', '+91 9999999999', '', repeat('3', 63) || 'a', repeat('3', 63) || 'b', repeat('3', 63) || 'c', choice_b);
  if r->>'room_unit_id' <> choice_b::text
    or (select room_unit_id from public.bookings where id = (r->>'id')::uuid) <> choice_b then raise exception 'Explicit room choice allocated a different unit'; end if;
  replay := public.create_booking('booking-choice-test', d + 20, d + 22, '11:00', 2,
    'Synthetic', 'Guest', 'synthetic@example.test', '+91 9999999999', '', repeat('3', 63) || 'a', repeat('3', 63) || 'b', repeat('3', 63) || 'c', choice_b);
  if replay <> r or (select count(*) from public.bookings where property_id = 'booking-choice-test') <> 1 then raise exception 'Chosen-room retry created a second reservation'; end if;
  if public.get_booking(r->>'booking_reference', repeat('3', 63) || 'c') <> r then raise exception 'Chosen-room private lookup lost the room selection'; end if;
  begin
    perform public.create_booking('booking-choice-test', d + 20, d + 22, '11:00', 2,
      'Synthetic', 'Guest', 'synthetic@example.test', '+91 9999999999', '', repeat('3', 63) || 'a', repeat('3', 63) || 'b', repeat('3', 63) || 'c', choice_a);
    raise exception 'Changed-room retry reused the original reservation';
  exception when raise_exception then if sqlerrm <> 'IDEMPOTENCY_CONFLICT' then raise; end if; end;
  begin
    perform public.create_booking('booking-choice-test', d + 21, d + 23, '11:00', 2,
      'Synthetic', 'Guest', 'synthetic@example.test', '+91 9999999999', '', repeat('4', 63) || 'a', repeat('4', 63) || 'b', repeat('4', 63) || 'c', choice_b);
    raise exception 'Blocked chosen room silently allocated another free unit';
  exception when raise_exception then if sqlerrm <> 'BOOKING_CONFLICT' then raise; end if; end;
  availability := public.booking_availability('booking-choice-test', date_trunc('month', d)::date, 2, d + 20, d + 22);
  if not (availability->>'available')::boolean
    or not exists (select 1 from jsonb_array_elements(availability->'room_options') x where x->>'id' = choice_a::text and (x->>'available')::boolean)
    or not exists (select 1 from jsonb_array_elements(availability->'room_options') x where x->>'id' = choice_b::text and not (x->>'available')::boolean) then raise exception 'Room options failed whole-stay availability'; end if;
  replay := public.create_booking('booking-choice-test', d + 22, d + 23, '11:00', 2,
    'Synthetic', 'Guest', 'synthetic@example.test', '+91 9999999999', '', repeat('5', 63) || 'a', repeat('5', 63) || 'b', repeat('5', 63) || 'c', choice_b);
  if replay->>'room_unit_id' <> choice_b::text then raise exception 'Adjacent stay blocked the selected room'; end if;
end;
$$;
rollback;
