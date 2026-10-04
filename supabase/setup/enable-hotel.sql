-- FINAL FIRST-HOTEL ENABLEMENT TEMPLATE. Run only after verified inventory reconciliation.
-- Empty defaults deliberately fail before changing booking_enabled.
begin;
do $$
declare
  hotel_id text := '';                     -- The actual previously configured hotel ID.
  confirmed_check_in_policy time := null;  -- Verified standard check-in clock time.
  confirmed_check_out_policy time := null; -- Verified standard check-out clock time.
  offline_inventory_reconciled boolean := false; -- Set true only after actual reconciliation.
begin
  if hotel_id is null or hotel_id not in ('khajaguda', 'dlf-road', 'tngo-colony', 'hitec-city') then
    raise exception 'Fill hotel_id with the verified hotel';
  end if;
  if confirmed_check_in_policy is null or confirmed_check_out_policy is null
    or confirmed_check_in_policy >= time '24:00' or confirmed_check_out_policy >= time '24:00'
    or extract(second from confirmed_check_in_policy) <> 0 or extract(second from confirmed_check_out_policy) <> 0 then
    raise exception 'Confirm the actual check-in and check-out policies before enablement';
  end if;
  if offline_inventory_reconciled is not true then
    raise exception 'Reconcile existing/offline/channel reservations against actual units before enabling online bookings';
  end if;
  perform 1 from public.booking_properties where id = hotel_id and not booking_enabled for update;
  if not found then raise exception 'Hotel must exist and still be disabled'; end if;
  if not exists (select 1 from public.booking_room_units where property_id = hotel_id and active)
    or not exists (select 1 from public.booking_arrival_slots where property_id = hotel_id and enabled) then
    raise exception 'Configure real active units and accepted arrival slots before enablement';
  end if;
  update public.booking_properties set booking_enabled = true where id = hotel_id;
end;
$$;
commit;

-- The policy values above are an operator review guard, not a new persisted policy API.
-- The reservation engine reserves nights and validates accepted arrival slots. Keep the
-- confirmed policy documented with the property; it does not assume a checkout clock time.
