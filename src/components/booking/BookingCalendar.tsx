"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { departurePreview } from './calendar-preview';
import { enhanceMotion } from '@/lib/motion';
import { nightsBetween } from './booking-client';
import './calendar.css';

type BookingCalendarProps = {
  motionPace?: 'standard' | 'gentle';
  preferenceOnly?: boolean;
  month: string;
  onMonthChange: (month: string) => void;
  checkIn: string;
  checkOut: string;
  onSelect: (date: string) => void;
  dates: Array<{ date: string; available: boolean }>;
  loading: boolean;
  unavailable: boolean;
  minDate: string;
  maxDate: string;
  selecting: "check_in" | "check_out";
  onRetry?: () => void;
};

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const fullWeekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const fullDateFormatter = new Intl.DateTimeFormat("en-IN", {
  weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
});
const monthFormatter = new Intl.DateTimeFormat("en-IN", {
  month: "long", timeZone: "UTC",
});
const shortDateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric", month: "short", timeZone: "UTC",
});

function dateValue(value: string): Date {
  return new Date(`${value}T12:00:00Z`);
}

function dateString(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function addDays(value: string, amount: number): string {
  const date = dateValue(value);
  date.setUTCDate(date.getUTCDate() + amount);
  return dateString(date);
}

function shiftMonth(value: string, amount: number): string {
  const date = dateValue(value);
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + amount);
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(day, lastDay));
  return dateString(date);
}

function indiaToday(): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date());
  const part = (name: string) => parts.find((item) => item.type === name)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export default function BookingCalendar({
  month, onMonthChange, checkIn, checkOut, onSelect, dates, loading, unavailable: availabilityUnavailable,
  minDate, maxDate, selecting, onRetry, motionPace = 'standard', preferenceOnly = false,
}: BookingCalendarProps) {
  // Before a hotel is chosen, dates are preferences and have no availability status.
  const unavailable = preferenceOnly || availabilityUnavailable;
  const id = useId();
  const [today] = useState(indiaToday);
  const [activeDate, setActiveDate] = useState(checkOut || checkIn || minDate);
  const [pointerDate, setPointerDate] = useState('');
  const [focusDate, setFocusDate] = useState('');
  const calendar = useRef<HTMLDivElement>(null);
  const motionMonth = useRef(month);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const pendingFocus = useRef<string | null>(null);
  const awaitingSelectionRefresh = useRef(false);
  const availability = useMemo(() => new Map(dates.map((date) => [date.date, date.available])), [dates]);
  const checkingAvailability = loading || (!unavailable && !dates.some((date) => date.date.startsWith(`${month}-`)));
  const firstDate = `${month}-01`;
  const firstDay = dateValue(firstDate);
  const daysInMonth = new Date(Date.UTC(firstDay.getUTCFullYear(), firstDay.getUTCMonth() + 1, 0)).getUTCDate();
  const leadingDays = (firstDay.getUTCDay() + 6) % 7;
  const cellCount = Math.ceil((leadingDays + daysInMonth) / 7) * 7;
  const monthDates = Array.from({ length: daysInMonth }, (_, day) => addDays(firstDate, day));
  const minimum = minDate > today ? minDate : today;
  const checkoutMinimum = checkIn ? addDays(checkIn, 1) : minimum;
  const checkoutMaximum = checkIn ? addDays(checkIn, 30) : maxDate;
  const lowerBound = selecting === "check_out" && checkoutMinimum > minimum ? checkoutMinimum : minimum;
  const upperBound = selecting === "check_out"
    ? checkoutMaximum < maxDate ? checkoutMaximum : maxDate
    : addDays(maxDate, -1);

  function isDateDisabled(value: string): boolean {
    if (value < lowerBound || value > upperBound) return true;
    // A sold-out night can still be the departure date of the preceding stay.
    return !unavailable && selecting === "check_in" && availability.get(value) === false;
  }

  const tabDate = monthDates.includes(activeDate) && !isDateDisabled(activeDate)
    ? activeDate
    : monthDates.find((value) => !isDateDisabled(value));
  const previousMonth = shiftMonth(firstDate, -1).slice(0, 7);
  const nextMonth = shiftMonth(firstDate, 1).slice(0, 7);
  const canGoBack = previousMonth >= lowerBound.slice(0, 7);
  const canGoForward = nextMonth <= upperBound.slice(0, 7);
  const previewDate = pointerDate || focusDate;
  const preview = selecting === "check_out" && !checkingAvailability && previewDate >= lowerBound
    && previewDate <= upperBound && previewDate.startsWith(`${month}-`)
    ? departurePreview(checkIn, previewDate, availability, unavailable)
    : null;

  const selectedNights = nightsBetween(checkIn, checkOut);
  const selectedStay = selectedNights > 0 && selectedNights <= 30
    ? `${shortDateFormatter.format(dateValue(checkIn))} — ${shortDateFormatter.format(dateValue(checkOut))} · ${selectedNights} ${selectedNights === 1 ? 'night' : 'nights'}` : '';
  const status = preferenceOnly ? selectedStay || 'Your preferred dates'
    : checkingAvailability ? "Checking availability…"
    : unavailable ? `${preview ? `Preview · ${preview.nights} ${preview.nights === 1 ? 'night' : 'nights'}` : selectedStay || 'Preferred dates'} · request only`
    : preview ? `Preview · ${preview.nights} ${preview.nights === 1 ? 'night' : 'nights'}`
    : selectedStay ? `${selectedStay} selected`
    : selecting === "check_out" ? "Choose your departure" : "Choose your arrival";
  const statusDetail = preferenceOnly ? "Choose a hotel next to check availability."
    : checkingAvailability ? "Checking nights for your selected property and guest count."
    : preview?.state === 'blocked' ? `The night of ${shortDateFormatter.format(dateValue(preview.blockedNight!))} is unavailable. Choose a shorter or different stay.`
    : preview?.state === 'unchecked' ? "Some nights are not checked yet. Full stay checked after selection."
    : unavailable ? "Our team will confirm availability."
    : preview ? "Full stay availability checked after selection."
    : selecting === "check_out" ? "Up to 30 nights. Your departure date is not a booked night."
    : "Marks show available nights. Full stay checked after date selection.";

  useEffect(() => {
    const before = motionMonth.current;
    motionMonth.current = month;
    const element = calendar.current;
    if (!element || before === month) return;
    const direction = month > before ? 1 : -1;
    return enhanceMotion(element, ({ gsap }) => {
      gsap.fromTo('.bk-calendar-grid', { x: direction * 10 }, { x: 0, duration: motionPace === 'gentle' ? .5 : .26, ease: 'power2.out', clearProps: 'transform' });
      gsap.fromTo('.bk-calendar-month-name', { yPercent: direction * 100 }, { yPercent: 0, duration: motionPace === 'gentle' ? .55 : .28, ease: 'power2.out', clearProps: 'transform' });
    });
  }, [month, motionPace]);

  useEffect(() => {
    if (!calendar.current) return;
    return enhanceMotion(calendar.current, ({ gsap }) => {
      gsap.fromTo('.bk-calendar-status-title > span', { yPercent: 35 }, { yPercent: 0, duration: motionPace === 'gentle' ? .4 : .18, ease: 'power2.out', clearProps: 'transform' });
    });
  }, [status, motionPace]);

  useEffect(() => {
    if (checkingAvailability) {
      awaitingSelectionRefresh.current = false;
      return;
    }
    if (!pendingFocus.current || pendingFocus.current.slice(0, 7) !== month) return;
    // Selecting an arrival starts a fresh availability request in the parent.
    // Wait for that response so focus is not immediately lost to disabled days.
    if (awaitingSelectionRefresh.current) return;
    const current = document.activeElement;
    if (current && current !== document.body && current !== document.documentElement && !calendar.current?.contains(current)) {
      pendingFocus.current = null;
      awaitingSelectionRefresh.current = false;
      return;
    }
    const desired = buttons.current.get(pendingFocus.current);
    const fallback = Array.from(buttons.current.values()).find((button) => !button.disabled);
    const target = desired && !desired.disabled ? desired : fallback;
    if (target) {
      target.focus();
      pendingFocus.current = null;
      awaitingSelectionRefresh.current = false;
    }
  }, [month, checkingAvailability, dates, selecting, checkIn, minDate, maxDate, unavailable]);

  function moveFocus(value: string, direction: number) {
    let next = value < lowerBound ? lowerBound : value > upperBound ? upperBound : value;
    // Skip dates that cannot be selected, keeping disabled nights out of the tab order.
    for (let attempt = 0; attempt < 366 && isDateDisabled(next); attempt += 1) {
      next = addDays(next, direction);
      if (next < lowerBound || next > upperBound) return;
    }
    if (isDateDisabled(next)) return;
    setActiveDate(next);
    if (next.slice(0, 7) !== month) {
      pendingFocus.current = next;
      awaitingSelectionRefresh.current = false;
      onMonthChange(next.slice(0, 7));
    } else {
      buttons.current.get(next)?.focus();
    }
  }

  function chooseDate(value: string) {
    setPointerDate('');
    setFocusDate('');
    if (selecting === "check_in") {
      const departure = addDays(value, 1);
      pendingFocus.current = departure;
      awaitingSelectionRefresh.current = !preferenceOnly && (value !== checkIn || Boolean(checkOut));
      setActiveDate(departure);
      if (departure.slice(0, 7) !== month) onMonthChange(departure.slice(0, 7));
    } else {
      setActiveDate(value);
    }
    onSelect(value);
  }

  function navigateMonth(value: string) {
    pendingFocus.current = null;
    awaitingSelectionRefresh.current = false;
    setPointerDate('');
    setFocusDate('');
    onMonthChange(value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, value: string) {
    let target: string;
    let direction = 1;
    const weekday = (dateValue(value).getUTCDay() + 6) % 7;
    switch (event.key) {
      case "ArrowRight": target = addDays(value, 1); break;
      case "ArrowLeft": target = addDays(value, -1); direction = -1; break;
      case "ArrowDown": target = addDays(value, 7); break;
      case "ArrowUp": target = addDays(value, -7); direction = -1; break;
      case "Home": target = addDays(value, -weekday); break;
      case "End": target = addDays(value, 6 - weekday); direction = -1; break;
      case "PageUp": target = shiftMonth(value, event.shiftKey ? -12 : -1); direction = -1; break;
      case "PageDown": target = shiftMonth(value, event.shiftKey ? 12 : 1); break;
      default: return;
    }
    event.preventDefault();
    setPointerDate('');
    moveFocus(target, direction);
  }

  function dateDescription(value: string): string {
    const descriptions = [fullDateFormatter.format(dateValue(value))];
    if (value === today) descriptions.push("Today");
    if (value === checkIn) descriptions.push("Check-in selected");
    if (value === checkOut) descriptions.push("Check-out selected");
    if (value > checkIn && value < checkOut && checkIn && checkOut) descriptions.push("Within your stay");
    if (value === checkIn && selecting === "check_out") descriptions.push("Choose departure after this date");
    else if (value < lowerBound || value > upperBound) descriptions.push("Outside the permitted date range");
    else if (checkingAvailability) descriptions.push("Checking availability");
    else if (preferenceOnly) descriptions.push("Preferred date; choose a hotel to check availability");
    else if (unavailable) descriptions.push("Preferred date; availability to be checked by our team");
    else if (isDateDisabled(value)) descriptions.push("Unavailable");
    else if (selecting === "check_out") descriptions.push("Departure date. Full stay availability checked after selection");
    else descriptions.push(availability.get(value) === true ? "Available night for check-in" : "Availability not checked for this night");
    return descriptions.join(". ");
  }

  return (
    <div className="bk-calendar bk-calendar-open-house" ref={calendar} data-preview-state={preview?.state}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusDate(''); }}>
      <div className="bk-calendar-heading">
        <div className="bk-calendar-month-rail">
          <p className="bk-calendar-year">{firstDay.getUTCFullYear()} <span aria-hidden="true">/</span> Hyderabad</p>
          <h3 className="bk-calendar-month" id={`${id}-month`} aria-live="polite">
            <span className="bk-calendar-month-name">{monthFormatter.format(firstDay)}</span><span className="bk-sr-only"> {firstDay.getUTCFullYear()}</span>
          </h3>
        </div>
        <div className="bk-calendar-nav">
          <button className="bk-icon-button" type="button" aria-label="Previous month" disabled={!canGoBack}
            onClick={() => navigateMonth(previousMonth)}>
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button className="bk-icon-button" type="button" aria-label="Next month" disabled={!canGoForward}
            onClick={() => navigateMonth(nextMonth)}>
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="bk-calendar-selection-rail">
        <p id={`${id}-prompt`}>{selecting === "check_in" ? "Select an arrival date" : "Select a departure date"}</p>
        <span>{preferenceOnly ? "Your dates" : unavailable ? "Request dates" : "Night availability"}</span>
      </div>
      <p className="bk-sr-only" id={`${id}-instructions`}>
        Use arrow keys to move between dates, Home and End to move within a week, and Page Up and Page Down to change month.
        Press Enter or Space to choose a date. Stays can be up to 30 nights.
      </p>
      <table className={`bk-calendar-grid${checkIn && checkOut ? " has-range" : ""}${preview ? " has-preview" : ""}`} role="grid"
        aria-labelledby={`${id}-prompt ${id}-month`} aria-describedby={`${id}-instructions ${id}-status`} aria-busy={checkingAvailability} key={month}
        onPointerLeave={() => setPointerDate('')}>
        <thead><tr>{weekdays.map((day, index) => (
          <th key={day} scope="col" className="bk-calendar-weekday"><abbr title={fullWeekdays[index]}>{day}</abbr></th>
        ))}</tr></thead>
        <tbody>{Array.from({ length: cellCount / 7 }, (_, week) => (
          <tr key={week}>{Array.from({ length: 7 }, (_, weekday) => {
            const number = week * 7 + weekday - leadingDays + 1;
            if (number < 1 || number > daysInMonth) return <td key={weekday} className="bk-calendar-empty" />;
            const value = addDays(firstDate, number - 1);
            const start = value === checkIn;
            const end = value === checkOut;
            const inRange = Boolean(checkIn && checkOut && value > checkIn && value < checkOut);
            const disabled = checkingAvailability || isDateDisabled(value);
            const soldOut = !unavailable && availability.get(value) === false && selecting === "check_in";
            const knownAvailable = !checkingAvailability && !unavailable && !disabled && availability.get(value) === true && selecting === "check_in";
            const previewRange = Boolean(preview && value > preview.start && value < preview.end);
            const previewStart = Boolean(preview && value === preview.start);
            const previewEnd = Boolean(preview && value === preview.end);
            const blockedPreviewNight = Boolean(preview?.state === 'blocked' && value === preview.blockedNight);
            return (
              <td key={weekday} className={`bk-calendar-cell${inRange ? " is-in-range" : ""}${start ? " is-range-start" : ""}${end ? " is-range-end" : ""}${previewRange ? " is-preview-range" : ""}${previewStart ? " is-preview-start" : ""}${previewEnd ? " is-preview-end" : ""}${blockedPreviewNight ? " is-preview-blocked" : ""}`}
                onPointerEnter={(event) => { if (event.pointerType === 'mouse' || event.pointerType === 'pen') setPointerDate(value); }}>
                <button type="button" className={`bk-calendar-day${start || end ? " is-selected" : ""}${value === today ? " is-today" : ""}${soldOut ? " is-unavailable" : ""}${knownAvailable ? " is-available" : ""}${unavailable && !disabled ? " is-request-date" : ""}${previewEnd ? " is-preview-end" : ""}`}
                  ref={(node) => { if (node) buttons.current.set(value, node); else buttons.current.delete(value); }}
                  disabled={disabled} tabIndex={!disabled && value === tabDate ? 0 : -1}
                  aria-label={dateDescription(value)} aria-pressed={start || end || inRange}
                  aria-current={value === today ? "date" : undefined}
                  onFocus={() => { setActiveDate(value); setFocusDate(value); }} onKeyDown={(event) => handleKeyDown(event, value)}
                  onClick={() => chooseDate(value)}>
                  <span className="bk-calendar-number">{number}</span>
                  {knownAvailable && <span className="bk-calendar-availability-mark" aria-hidden="true" />}
                  {value === today && <span className="bk-calendar-today" aria-hidden="true" />}
                </button>
              </td>
            );
          })}</tr>
        ))}</tbody>
      </table>
      <div className="bk-calendar-footer">
        <div className={`bk-calendar-status${unavailable ? " is-offline" : ""}${preview?.state === 'blocked' ? " is-blocked" : ""}`} id={`${id}-status`} role="status" aria-live="polite" aria-atomic="true">
          <p className="bk-calendar-status-title"><span>{status}</span></p>
          <p className="bk-calendar-status-detail">{statusDetail}</p>
        </div>
        {onRetry && (unavailable || checkingAvailability) && <button className="bk-calendar-retry" type="button" onClick={onRetry} disabled={checkingAvailability}>{checkingAvailability ? 'Checking…' : 'Check again'}</button>}
        {!checkingAvailability && !unavailable && (
          <div className="bk-calendar-legend">
            {selecting === "check_in" ? <>
              <span><i className="bk-calendar-legend-available" aria-hidden="true" />Available night</span>
              <span><i className="bk-calendar-legend-unavailable" aria-hidden="true" />Unavailable</span>
            </> : <span><i className="bk-calendar-legend-selected" aria-hidden="true" />Selected arrival</span>}
          </div>
        )}
      </div>
    </div>
  );
}
