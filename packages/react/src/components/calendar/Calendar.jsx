import { useState, useEffect, useRef } from "react";
import { Button }      from "../button/Button.jsx";
import { IconButton }  from "../icon-button/IconButton.jsx";
import { SelectField } from "../field/SelectField.jsx";
import { useLabel }    from "../labels/Labels.jsx";
import "./calendar.css";

function addMonths(year, month, delta) {
  let m = month + delta;
  let y = year;
  while (m < 0)  { m += 12; y--; }
  while (m > 11) { m -= 12; y++; }
  return { year: y, month: m };
}

function rotateArray(arr, n) {
  return [...arr.slice(n), ...arr.slice(0, n)];
}

function buildWeeks(year, month, weekStart = 0) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay    = new Date(year, month, 1).getDay();
  const offset      = (firstDay - weekStart + 7) % 7;
  const weeks       = [];
  let week          = new Array(offset).fill(null);

  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

export function Calendar({
  initialMonth,
  monthsToShow = 13,
  highlightToday = true,
  dimPast = true,
  variant = "scroll",
  todayButton = false,
  selectable = false,
  selectedDate,
  defaultSelectedDate,
  onChange,
  minDate,
  maxDate,
  className = "",
  ...props
}) {
  const today      = new Date();
  const todayYear  = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay   = today.getDate();

  let centerYear = todayYear, centerMonth = todayMonth;
  if (initialMonth instanceof Date) {
    centerYear  = initialMonth.getFullYear();
    centerMonth = initialMonth.getMonth();
  } else if (initialMonth && typeof initialMonth === "object") {
    centerYear  = initialMonth.year;
    centerMonth = initialMonth.month - 1;
  }

  const [viewYear, setViewYear]   = useState(centerYear);
  const [viewMonth, setViewMonth] = useState(centerMonth);
  const currentMonthRef           = useRef(null);

  // Selection — controlled when selectedDate is provided, otherwise internal state
  const isControlled = selectedDate !== undefined;
  const [internalSelected, setInternalSelected] = useState(defaultSelectedDate ?? null);
  const selected = isControlled ? selectedDate : internalSelected;

  function isSameDay(d, y, m, day) {
    return d instanceof Date && d.getFullYear() === y && d.getMonth() === m && d.getDate() === day;
  }

  function isDayDisabled(y, m, day) {
    const date = new Date(y, m, day);
    if (minDate) {
      const min = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
      if (date < min) return true;
    }
    if (maxDate) {
      const max = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
      if (date > max) return true;
    }
    return false;
  }

  function handleDayClick(y, m, day) {
    if (isDayDisabled(y, m, day)) return;
    const date = new Date(y, m, day);
    if (!isControlled) setInternalSelected(date);
    onChange?.(date);
  }

  // ── Localised strings ─────────────────────────────────────────

  // Month names
  const monthJan = useLabel("calendar.month.january",   "January");
  const monthFeb = useLabel("calendar.month.february",  "February");
  const monthMar = useLabel("calendar.month.march",     "March");
  const monthApr = useLabel("calendar.month.april",     "April");
  const monthMay = useLabel("calendar.month.may",       "May");
  const monthJun = useLabel("calendar.month.june",      "June");
  const monthJul = useLabel("calendar.month.july",      "July");
  const monthAug = useLabel("calendar.month.august",    "August");
  const monthSep = useLabel("calendar.month.september", "September");
  const monthOct = useLabel("calendar.month.october",   "October");
  const monthNov = useLabel("calendar.month.november",  "November");
  const monthDec = useLabel("calendar.month.december",  "December");

  // Weekday full names (used in abbr attribute and aria-label)
  const dayFullSun = useLabel("calendar.weekday.sunday.full",    "Sunday");
  const dayFullMon = useLabel("calendar.weekday.monday.full",    "Monday");
  const dayFullTue = useLabel("calendar.weekday.tuesday.full",   "Tuesday");
  const dayFullWed = useLabel("calendar.weekday.wednesday.full", "Wednesday");
  const dayFullThu = useLabel("calendar.weekday.thursday.full",  "Thursday");
  const dayFullFri = useLabel("calendar.weekday.friday.full",    "Friday");
  const dayFullSat = useLabel("calendar.weekday.saturday.full",  "Saturday");

  // Weekday 2-letter abbreviations (medium containers)
  const dayShortSun = useLabel("calendar.weekday.sunday.short",    "Su");
  const dayShortMon = useLabel("calendar.weekday.monday.short",    "Mo");
  const dayShortTue = useLabel("calendar.weekday.tuesday.short",   "Tu");
  const dayShortWed = useLabel("calendar.weekday.wednesday.short", "We");
  const dayShortThu = useLabel("calendar.weekday.thursday.short",  "Th");
  const dayShortFri = useLabel("calendar.weekday.friday.short",    "Fr");
  const dayShortSat = useLabel("calendar.weekday.saturday.short",  "Sa");

  // Weekday 1-letter abbreviations (smallest containers)
  const dayLetterSun = useLabel("calendar.weekday.sunday.letter",    "S");
  const dayLetterMon = useLabel("calendar.weekday.monday.letter",    "M");
  const dayLetterTue = useLabel("calendar.weekday.tuesday.letter",   "T");
  const dayLetterWed = useLabel("calendar.weekday.wednesday.letter", "W");
  const dayLetterThu = useLabel("calendar.weekday.thursday.letter",  "T");
  const dayLetterFri = useLabel("calendar.weekday.friday.letter",    "F");
  const dayLetterSat = useLabel("calendar.weekday.saturday.letter",  "S");

  // Navigation labels
  const prevMonthLabel   = useLabel("calendar.previousMonth", "Previous month");
  const nextMonthLabel   = useLabel("calendar.nextMonth",     "Next month");
  const selectMonthLabel = useLabel("calendar.selectMonth",   "Month");
  const selectYearLabel  = useLabel("calendar.selectYear",    "Year");
  const todayLabel       = useLabel("calendar.today",         "Today");

  // Locale config
  const weekStartStr = useLabel("calendar.weekStart",  "0");
  const directionStr = useLabel("calendar.direction",  "ltr");

  // Build localised arrays used throughout the render
  const MONTHS = [monthJan, monthFeb, monthMar, monthApr, monthMay, monthJun,
                  monthJul, monthAug, monthSep, monthOct, monthNov, monthDec];

  const weekStartDay = parseInt(weekStartStr, 10) || 0;
  const isRtl = directionStr === "rtl";

  // Weekday headers rotated so the correct start day is first
  const WEEKDAYS_LONG   = rotateArray([dayFullSun, dayFullMon, dayFullTue, dayFullWed, dayFullThu, dayFullFri, dayFullSat], weekStartDay);
  const WEEKDAYS_SHORT  = rotateArray([dayShortSun, dayShortMon, dayShortTue, dayShortWed, dayShortThu, dayShortFri, dayShortSat], weekStartDay);
  const WEEKDAYS_LETTER = rotateArray([dayLetterSun, dayLetterMon, dayLetterTue, dayLetterWed, dayLetterThu, dayLetterFri, dayLetterSat], weekStartDay);

  useEffect(() => {
    if (variant !== "scroll") return;
    const el = currentMonthRef.current;
    if (!el) return;

    // Walk up to find the nearest explicitly scrollable ancestor, stopping at
    // the document root so we never scroll the page itself.
    let container = el.parentElement;
    while (container && container !== document.documentElement) {
      const oy = window.getComputedStyle(container).overflowY;
      if (oy === "auto" || oy === "scroll" || oy === "overlay") break;
      container = container.parentElement;
    }

    if (!container || container === document.documentElement) return;

    const containerRect = container.getBoundingClientRect();
    const elRect        = el.getBoundingClientRect();
    container.scrollTop += elRect.top - containerRect.top;
  }, []);

  // Renders the weekday/day grid table — shared between both variants
  function renderGrid(year, month, monthStarted) {
    const weeks = buildWeeks(year, month, weekStartDay);
    return (
      <table
        className="a1-calendar__grid"
        role="grid"
        aria-label={`${MONTHS[month]} ${year}`}
      >
        <thead className="a1-calendar__thead">
          <tr>
            {WEEKDAYS_LONG.map((name, i) => (
              <th
                key={name}
                className="a1-calendar__weekday"
                scope="col"
                abbr={name}
              >
                <span className="a1-calendar__weekday-label a1-calendar__weekday-label--long">
                  {name.slice(0, 3)}
                </span>
                <span className="a1-calendar__weekday-label a1-calendar__weekday-label--short">
                  {WEEKDAYS_SHORT[i]}
                </span>
                <span className="a1-calendar__weekday-label a1-calendar__weekday-label--letter">
                  {WEEKDAYS_LETTER[i]}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi} className="a1-calendar__week">
              {week.map((day, di) => {
                if (day === null) {
                  const isLeadingBlank = wi === 0 && monthStarted;
                  return (
                    <td
                      key={di}
                      className={[
                        "a1-calendar__day",
                        "a1-calendar__day--empty",
                        isLeadingBlank && "a1-calendar__day--past",
                      ].filter(Boolean).join(" ")}
                      aria-hidden="true"
                    />
                  );
                }

                const isToday =
                  highlightToday &&
                  year === todayYear &&
                  month === todayMonth &&
                  day === todayDay;

                const isPast =
                  dimPast &&
                  new Date(year, month, day) < new Date(todayYear, todayMonth, todayDay);

                const isSelected = isSameDay(selected, year, month, day);
                const isDisabled = isDayDisabled(year, month, day);

                return (
                  <td
                    key={di}
                    className={[
                      "a1-calendar__day",
                      isToday    && "a1-calendar__day--today",
                      isPast     && "a1-calendar__day--past",
                      isSelected && "a1-calendar__day--selected",
                      isDisabled && "a1-calendar__day--disabled",
                    ].filter(Boolean).join(" ")}
                    aria-current={isToday ? "date" : undefined}
                    aria-selected={isSelected ? true : undefined}
                    aria-disabled={isDisabled ? true : undefined}
                    tabIndex={selectable && !isDisabled ? 0 : undefined}
                    onClick={selectable && !isDisabled ? () => handleDayClick(year, month, day) : undefined}
                    onKeyDown={selectable && !isDisabled ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleDayClick(year, month, day);
                      }
                    } : undefined}
                  >
                    <span className="a1-calendar__day-number" aria-hidden="true">
                      {day}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // ── Paginated variant ─────────────────────────────────────────
  if (variant === "paginated") {
    const minYear = minDate ? minDate.getFullYear() : todayYear - 10;
    const minMon  = minDate ? minDate.getMonth()    : 0;
    const maxYear = maxDate ? maxDate.getFullYear() : todayYear + 15;
    const maxMon  = maxDate ? maxDate.getMonth()    : 11;

    const yearStart = minDate ? minDate.getFullYear() : todayYear - 10;
    const yearEnd   = maxDate ? maxDate.getFullYear() : todayYear + 15;
    const years     = Array.from({ length: yearEnd - yearStart + 1 }, (_, i) => yearStart + i);

    const prevAtMin = viewYear === minYear && viewMonth === minMon;
    const nextAtMax = viewYear === maxYear && viewMonth === maxMon;

    const goPrev = () => {
      if (prevAtMin) return;
      const p = addMonths(viewYear, viewMonth, -1);
      setViewYear(p.year);
      setViewMonth(p.month);
    };

    const goNext = () => {
      if (nextAtMax) return;
      const n = addMonths(viewYear, viewMonth, 1);
      setViewYear(n.year);
      setViewMonth(n.month);
    };

    const goToday = () => {
      setViewYear(todayYear);
      setViewMonth(todayMonth);
    };

    const isCurrentMonth = viewYear === todayYear && viewMonth === todayMonth;

    const monthStarted = dimPast &&
      new Date(viewYear, viewMonth, 1) <= new Date(todayYear, todayMonth, todayDay);

    return (
      <div
        className={["a1-calendar", "a1-calendar--paginated", selectable && "a1-calendar--selectable", className].filter(Boolean).join(" ")}
        {...props}
      >
        <div className="a1-calendar__inner">
          <div className="a1-calendar__nav">

            <span className="a1-calendar__nav-wide">
              <Button variant="tertiary" size="sm" icon={isRtl ? "chevron_right" : "chevron_left"} iconPosition="start" onClick={goPrev} disabled={prevAtMin}>
                {prevMonthLabel}
              </Button>
            </span>
            <span className="a1-calendar__nav-narrow">
              <IconButton icon={isRtl ? "chevron_right" : "chevron_left"} label={prevMonthLabel} variant="tertiary" onClick={goPrev} disabled={prevAtMin} />
            </span>

            <div className="a1-calendar__nav-label">
              <SelectField
                className="a1-calendar__nav-field"
                size="compact"
                aria-label={selectMonthLabel}
                value={viewMonth}
                onChange={e => setViewMonth(Number(e.target.value))}
              >
                {MONTHS.map((name, i) => {
                  const disabled =
                    (viewYear === minYear && i < minMon) ||
                    (viewYear === maxYear && i > maxMon);
                  return <option key={i} value={i} disabled={disabled}>{name}</option>;
                })}
              </SelectField>
              <SelectField
                className="a1-calendar__nav-field"
                size="compact"
                aria-label={selectYearLabel}
                value={viewYear}
                onChange={e => setViewYear(Number(e.target.value))}
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </SelectField>
              {todayButton && (
                <div className="a1-calendar__nav-today">
                  <span className="a1-calendar__nav-wide">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={goToday}
                      disabled={isCurrentMonth}
                    >
                      {todayLabel}
                    </Button>
                  </span>
                  <span className="a1-calendar__nav-narrow">
                    <IconButton
                      icon="calendar_today"
                      label={todayLabel}
                      variant="secondary"
                      onClick={goToday}
                      disabled={isCurrentMonth}
                    />
                  </span>
                </div>
              )}
            </div>

            <span className="a1-calendar__nav-wide">
              <Button variant="tertiary" size="sm" icon={isRtl ? "chevron_left" : "chevron_right"} iconPosition="end" onClick={goNext} disabled={nextAtMax}>
                {nextMonthLabel}
              </Button>
            </span>
            <span className="a1-calendar__nav-narrow">
              <IconButton icon={isRtl ? "chevron_left" : "chevron_right"} label={nextMonthLabel} variant="tertiary" onClick={goNext} disabled={nextAtMax} />
            </span>

          </div>

          {renderGrid(viewYear, viewMonth, monthStarted)}
        </div>
      </div>
    );
  }

  // ── Scroll variant (default) ──────────────────────────────────
  const half   = Math.floor(monthsToShow / 2);
  const months = Array.from({ length: monthsToShow }, (_, i) =>
    addMonths(centerYear, centerMonth, i - half)
  );

  return (
    <div
      className={["a1-calendar", selectable && "a1-calendar--selectable", className].filter(Boolean).join(" ")}
      {...props}
    >
      <div className="a1-calendar__inner">
        {months.map(({ year, month }) => {
          const isCurrent    = year === todayYear && month === todayMonth;
          const monthStarted = dimPast &&
            new Date(year, month, 1) <= new Date(todayYear, todayMonth, todayDay);

          return (
            <section
              key={`${year}-${month}`}
              className={[
                "a1-calendar__month",
                isCurrent && "a1-calendar__month--current",
              ].filter(Boolean).join(" ")}
              ref={isCurrent ? currentMonthRef : undefined}
            >
              <h2 className="a1-calendar__month-heading">
                <span className="a1-calendar__month-name">{MONTHS[month]}</span>
                <span className="a1-calendar__year">{year}</span>
              </h2>
              {renderGrid(year, month, monthStarted)}
            </section>
          );
        })}
      </div>
    </div>
  );
}
