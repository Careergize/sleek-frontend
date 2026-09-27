import React, { useMemo, useRef, useState } from "react";
import {
  Info,
  SlidersHorizontal,
  Calendar,
  ZoomIn,
  ZoomOut,
  Maximize,
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
  Mail,
  Baby,
  CreditCard,
} from "lucide-react";

/**
 * CarRentalPlanner
 * -----------------
 * A Gantt-style booking planner for a car rental fleet.
 *
 * Data shapes (matches your Django models):
 *
 * Car:
 *   { id, name, seats, trim, color }        // "color" is a hex swatch for the trim dot
 *
 * Booking (mirrors the Django `Booking` model):
 *   {
 *     id, car,                              // car = Car.id (FK)
 *     pickup_date, dropoff_date,            // "YYYY-MM-DD"
 *     pickup_time, dropoff_time,            // free text, e.g. "10:30"
 *     name, phone, email,
 *     baby_seat, pay_now,
 *     total_price, status,                  // status drives the pill color, see STATUS_META
 *     payment_status, created_at,
 *   }
 *
 * Wire it up to your API by fetching /api/cars and /api/bookings and passing
 * them in as the `cars` and `bookings` props — the mock data below is only
 * a stand-in so the component renders out of the box.
 */

// ---------------------------------------------------------------------------
// Status styling — extend/rename to match whatever values your `status`
// field actually uses. The API currently supports pending and confirmed.
// ---------------------------------------------------------------------------
const STATUS_META = {
  pending: { label: "Pending", bar: "bg-amber-500", ring: "ring-amber-600" },
  confirmed: { label: "Confirmed", bar: "bg-emerald-600", ring: "ring-emerald-700" },
};
const FALLBACK_STATUS = "pending";
const FALLBACK_META = { label: "Unknown", bar: "bg-slate-500", ring: "ring-slate-600" };

// ---------------------------------------------------------------------------
// Mock fleet + bookings — replace with real data via props
// ---------------------------------------------------------------------------
const MOCK_CARS = [
  { id: 1, name: "Kawasaki Ninja 250R", seats: 2, trim: "The Power of Dreams", color: "#111827" },
  { id: 2, name: "Honda Civic Type R", seats: 5, trim: "Civic R", color: "#111827" },
  { id: 3, name: "Alfa Romeo Stelvio", seats: 5, trim: "Quadrifoglio", color: "#1d4ed8" },
  { id: 4, name: "Peugeot 408 GT", seats: 5, trim: "GT Speed", color: "#1e3a8a" },
  { id: 5, name: "Audi RS6", seats: 5, trim: "Quattro", color: "#111827" },
  { id: 6, name: "Jeep Avenger 2024", seats: 5, trim: "Grand", color: "#eab308" },
  { id: 7, name: "Volkswagen Tiguan", seats: 5, trim: "R-Line", color: "#1e293b" },
  { id: 8, name: "Bugatti Chiron", seats: 2, trim: "SuperCar", color: "#2563eb" },
  { id: 9, name: "Seat Leon ST FR", seats: 5, trim: "Cupra", color: "#dc2626" },
];

const MOCK_BOOKINGS = [
  { id: 742, car: 1, pickup_date: "2025-02-04", dropoff_date: "2025-02-11", pickup_time: "03:14", dropoff_time: "03:14", name: "Ivan Petrov", phone: "+380501112233", email: "ivan@example.com", baby_seat: false, pay_now: true, total_price: 70.9, status: "reserved", payment_status: "paid" },
  { id: 426, car: 1, pickup_date: "2025-02-14", dropoff_date: "2025-03-02", pickup_time: "20:03", dropoff_time: "16:19", name: "Genry Rentsyst", phone: "+380502223344", email: "genry@example.com", baby_seat: false, pay_now: true, total_price: 364.0, status: "reserved", payment_status: "pending" },
  { id: 408, car: 2, pickup_date: "2025-02-07", dropoff_date: "2025-02-14", pickup_time: "11:24", dropoff_time: "11:24", name: "Olga Bondar", phone: "+380503334455", email: "olga@example.com", baby_seat: true, pay_now: false, total_price: 441.37, status: "reserved", payment_status: "paid" },
  { id: 182, car: 2, pickup_date: "2025-02-18", dropoff_date: "2025-02-22", pickup_time: "09:00", dropoff_time: "09:00", name: "Marko Diaz", phone: "+380504445566", email: "marko@example.com", baby_seat: false, pay_now: true, total_price: 210.0, status: "in_service", payment_status: "paid" },
  { id: 743, car: 2, pickup_date: "2025-02-25", dropoff_date: "2025-02-28", pickup_time: "10:00", dropoff_time: "10:00", name: "Dana White", phone: "+380505556677", email: "dana@example.com", baby_seat: false, pay_now: true, total_price: 190.0, status: "done", payment_status: "paid" },
  { id: 326, car: 3, pickup_date: "2025-02-04", dropoff_date: "2025-02-17", pickup_time: "22:18", dropoff_time: "21:14", name: "Genry Rentsyst", phone: "+380506667788", email: "genry@example.com", baby_seat: false, pay_now: true, total_price: 150.0, status: "booking", payment_status: "pending" },
  { id: 753, car: 3, pickup_date: "2025-02-19", dropoff_date: "2025-02-20", pickup_time: "08:00", dropoff_time: "18:00", name: "Kevin Ash", phone: "+380507778899", email: "kevin@example.com", baby_seat: false, pay_now: true, total_price: 80.0, status: "reserved", payment_status: "paid" },
  { id: 754, car: 3, pickup_date: "2025-02-22", dropoff_date: "2025-02-24", pickup_time: "09:00", dropoff_time: "09:00", name: "Petra Novak", phone: "+380508889900", email: "petra@example.com", baby_seat: false, pay_now: false, total_price: 120.0, status: "rental", payment_status: "pending" },
  { id: 145, car: 4, pickup_date: "2025-02-07", dropoff_date: "2025-02-23", pickup_time: "11:42", dropoff_time: "15:29", name: "Sam Turner", phone: "+380509990011", email: "sam@example.com", baby_seat: true, pay_now: true, total_price: 200.0, status: "open", payment_status: "pending" },
  { id: 575, car: 5, pickup_date: "2025-02-09", dropoff_date: "2025-02-16", pickup_time: "00:51", dropoff_time: "00:51", name: "Nadia Kalyn", phone: "+380501230011", email: "nadia@example.com", baby_seat: false, pay_now: true, total_price: 427.0, status: "reserved", payment_status: "paid" },
  { id: 420, car: 5, pickup_date: "2025-02-22", dropoff_date: "2025-03-06", pickup_time: "09:57", dropoff_time: "15:06", name: "Leo Farrell", phone: "+380501230022", email: "leo@example.com", baby_seat: false, pay_now: true, total_price: 362.3, status: "rental", payment_status: "paid" },
  { id: 601, car: 6, pickup_date: "2025-02-01", dropoff_date: "2025-02-02", pickup_time: "09:00", dropoff_time: "18:00", name: "Anya Bell", phone: "+380501230033", email: "anya@example.com", baby_seat: false, pay_now: true, total_price: 60.0, status: "done", payment_status: "paid" },
  { id: 368, car: 6, pickup_date: "2025-02-24", dropoff_date: "2025-03-06", pickup_time: "00:00", dropoff_time: "23:00", name: "Chris Lund", phone: "+380501230044", email: "chris@example.com", baby_seat: false, pay_now: true, total_price: 480.0, status: "reserved", payment_status: "pending" },
  { id: 501, car: 6, pickup_date: "2025-02-11", dropoff_date: "2025-02-28", pickup_time: "00:00", dropoff_time: "23:00", name: "Tester Tester", phone: "+380501230055", email: "tester@example.com", baby_seat: false, pay_now: true, total_price: 479.2, status: "reserved", payment_status: "paid" },
  { id: 137, car: 7, pickup_date: "2025-02-13", dropoff_date: "2025-02-20", pickup_time: "17:32", dropoff_time: "05:55", name: "Rita Cole", phone: "+380501230066", email: "rita@example.com", baby_seat: true, pay_now: false, total_price: 1000.0, status: "rental", payment_status: "pending" },
  { id: 733, car: 8, pickup_date: "2025-02-01", dropoff_date: "2025-02-02", pickup_time: "10:00", dropoff_time: "18:00", name: "Omar Faruk", phone: "+380501230077", email: "omar@example.com", baby_seat: false, pay_now: true, total_price: 900.0, status: "reserved", payment_status: "paid" },
  { id: 404, car: 8, pickup_date: "2025-02-09", dropoff_date: "2025-02-15", pickup_time: "04:48", dropoff_time: "04:48", name: "Zara Khan", phone: "+380501230088", email: "zara@example.com", baby_seat: false, pay_now: true, total_price: 482.95, status: "rental", payment_status: "paid" },
  { id: 390, car: 9, pickup_date: "2025-02-09", dropoff_date: "2025-02-13", pickup_time: "00:00", dropoff_time: "00:00", name: "Igor Lys", phone: "+380501230099", email: "igor@example.com", baby_seat: false, pay_now: true, total_price: 300.0, status: "rental", payment_status: "pending" },
  { id: 755, car: 9, pickup_date: "2025-02-27", dropoff_date: "2025-03-01", pickup_time: "09:00", dropoff_time: "09:00", name: "Vika Orlova", phone: "+380501230100", email: "vika@example.com", baby_seat: false, pay_now: true, total_price: 150.0, status: "reserved", payment_status: "paid" },
];

// ---------------------------------------------------------------------------
// Date helpers — parsed as UTC so day-diff math never trips on DST
// ---------------------------------------------------------------------------
const MS_DAY = 86400000;
const parseDate = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};
const addDays = (date, n) => new Date(date.getTime() + n * MS_DAY);
const diffDays = (a, b) => Math.round((b.getTime() - a.getTime()) / MS_DAY);
const fmtHeader = (d) => ({
  weekday: d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
  day: String(d.getUTCDate()).padStart(2, "0"),
  month: String(d.getUTCMonth() + 1).padStart(2, "0"),
});
const fmtLong = (d) => d.toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" });
const fmtShort = (dateStr, timeStr) => {
  const d = parseDate(dateStr);
  return `${String(d.getUTCDate()).padStart(2, "0")}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.${d.getUTCFullYear()}/${timeStr}`;
};
const isSameUTCDate = (a, b) =>
  a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth() && a.getUTCDate() === b.getUTCDate();

// Greedy interval packing so overlapping bookings on one car stack into lanes
// instead of covering each other (mirrors the "Overbooking" row in the ref).
function packLanes(bookings) {
  const sorted = [...bookings].sort((a, b) => parseDate(a.pickup_date) - parseDate(b.pickup_date));
  const laneEnds = []; // last dropoff date per lane
  const placed = [];
  for (const b of sorted) {
    const start = parseDate(b.pickup_date);
    const end = parseDate(b.dropoff_date);
    let lane = laneEnds.findIndex((endDate) => endDate <= start);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(end);
    } else {
      laneEnds[lane] = end;
    }
    placed.push({ ...b, lane });
  }
  return { items: placed, laneCount: Math.max(1, laneEnds.length) };
}

const NAME_COL_WIDTH = 224;
const LANE_HEIGHT = 60;
const LANE_GAP = 6;
const VISIBLE_DAYS = 30;

export default function CarRentalPlanner({ cars = MOCK_CARS, bookings = MOCK_BOOKINGS }) {
  const [rangeStart, setRangeStart] = useState(() => {
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const recentBookingDates = bookings
      .filter((booking) => booking.pickup_date)
      .map((booking) => parseDate(booking.pickup_date))
      .filter((pickupDate) => {
        const daysAgo = diffDays(pickupDate, today);
        return daysAgo > 0 && daysAgo < VISIBLE_DAYS;
      });

    return recentBookingDates.length
      ? recentBookingDates.reduce((earliest, date) => date < earliest ? date : earliest)
      : today;
  });
  const [dayWidth, setDayWidth] = useState(92);
  const [activeStatuses, setActiveStatuses] = useState(() => new Set(Object.keys(STATUS_META)));
  const [selected, setSelected] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const containerRef = useRef(null);

  const days = useMemo(
    () => Array.from({ length: VISIBLE_DAYS }, (_, i) => addDays(rangeStart, i)),
    [rangeStart]
  );
  const timelineWidth = VISIBLE_DAYS * dayWidth;
  const today = useMemo(() => {
    const t = new Date();
    return new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()));
  }, []);
  const todayOffset = diffDays(rangeStart, today);

  const visibleBookings = useMemo(
    () => bookings.filter((b) => activeStatuses.has(b.status ?? FALLBACK_STATUS)),
    [bookings, activeStatuses]
  );

  const rows = useMemo(
    () =>
      cars.map((car) => {
        const carBookings = visibleBookings.filter((b) => String(b.car) === String(car.id));
        return { car, ...packLanes(carBookings) };
      }),
    [cars, visibleBookings]
  );

  function toggleStatus(key) {
    setActiveStatuses((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next.size ? next : new Set([key]); // never allow zero statuses selected
    });
  }

  function shiftRange(days_) {
    setRangeStart((d) => addDays(d, days_));
  }

  function toggleFullscreen() {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  }

  return (
    <div ref={containerRef} className="flex h-full min-h-[640px] w-full flex-col bg-black text-slate-100">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <button className="grid h-7 w-7 place-items-center rounded-full border border-slate-700 text-slate-400">
            <Info size={15} />
          </button>
          {Object.entries(STATUS_META).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => toggleStatus(key)}
              className={`rounded-full px-3 py-1 text-xs font-semibold text-white transition ${meta.bar} ${
                activeStatuses.has(key) ? "opacity-100" : "opacity-30"
              }`}
            >
              {meta.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setFiltersOpen((o) => !o)}
              className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-900"
            >
              <SlidersHorizontal size={15} />
              Filters
            </button>
            {filtersOpen && (
              <div className="absolute right-0 z-30 mt-2 w-48 rounded-lg border border-slate-700 bg-slate-900 p-2 shadow-lg">
                <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Show status
                </p>
                {Object.entries(STATUS_META).map(([key, meta]) => (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
                  >
                    <input
                      type="checkbox"
                      checked={activeStatuses.has(key)}
                      onChange={() => toggleStatus(key)}
                      className="accent-slate-700"
                    />
                    <span className={`h-2.5 w-2.5 rounded-full ${meta.bar}`} />
                    {meta.label}
                  </label>
                ))}
              </div>
            )}
          </div>

                  <div className="flex items-center gap-1 rounded-lg border border-slate-700 px-2 py-1.5 text-sm text-slate-300">
            <Calendar size={15} className="text-slate-400" />
            <button onClick={() => shiftRange(-7)} className="rounded p-0.5 hover:bg-slate-100">
              <ChevronLeft size={14} />
            </button>
            <span className="min-w-[130px] text-center font-medium">{fmtLong(rangeStart)}</span>
            <button onClick={() => shiftRange(7)} className="rounded p-0.5 hover:bg-slate-100">
              <ChevronRight size={14} />
            </button>
          </div>

          <button
            onClick={() => setDayWidth((w) => Math.min(140, w + 12))}
              className="grid h-8 w-8 place-items-center rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-900"
            title="Zoom in"
          >
            <ZoomIn size={15} />
          </button>
          <button
            onClick={() => setDayWidth((w) => Math.max(48, w - 12))}
            className="grid h-8 w-8 place-items-center rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-900"
            title="Zoom out"
          >
            <ZoomOut size={15} />
          </button>
          <button
            onClick={toggleFullscreen}
            className="grid h-8 w-8 place-items-center rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-900"
            title="Fullscreen"
          >
            <Maximize size={15} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="relative flex-1 overflow-auto">
        <div
          className="grid"
          style={{ gridTemplateColumns: `${NAME_COL_WIDTH}px ${timelineWidth}px` }}
        >
          {/* Corner cell */}
          <div className="sticky top-0 left-0 z-30 border-b border-r border-slate-800 bg-slate-950" />

          {/* Date header */}
          <div className="sticky top-0 z-20 bg-slate-950">
            <div className="flex border-b border-slate-800">
              {days.map((d, i) => {
                const { weekday, day, month } = fmtHeader(d);
                const isToday = isSameUTCDate(d, today);
                return (
                  <div
                    key={i}
                    style={{ width: dayWidth }}
                    className={`shrink-0 border-r border-slate-800 py-1.5 text-center ${
                      isToday ? "bg-sky-950/60" : ""
                    }`}
                  >
                    <div className="text-[11px] font-medium text-slate-400">{weekday}</div>
                    <div className={`text-sm font-semibold ${isToday ? "text-sky-300" : "text-slate-200"}`}>
                      {day}.{month}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vehicle rows + timeline rows */}
          {rows.map(({ car, items, laneCount }) => {
            const rowHeight = laneCount * LANE_HEIGHT + (laneCount - 1) * LANE_GAP + 16;
            return (
              <React.Fragment key={car.id}>
                {/* Sticky vehicle info cell */}
                <div
                  className="sticky left-0 z-10 flex flex-col justify-center gap-1 border-b border-r border-slate-800 bg-slate-950 px-4"
                  style={{ minHeight: rowHeight }}
                >
                  <p className="text-sm font-bold uppercase tracking-tight text-slate-100">{car.name}</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {car.seats}
                  </div>
                  <span
                    className="inline-flex w-fit items-center gap-1.5 rounded border border-slate-700 px-1.5 py-0.5 text-[11px] font-medium text-slate-300"
                  >
                    <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: car.color }} />
                    {car.trim}
                  </span>
                </div>

                {/* Timeline cell for this car */}
                <div
                  className="relative border-b border-slate-800"
                  style={{ width: timelineWidth, minHeight: rowHeight }}
                >
                  {/* day gridlines */}
                  <div className="absolute inset-0 flex">
                    {days.map((_, i) => (
                      <div key={i} style={{ width: dayWidth }} className="h-full shrink-0 border-r border-slate-800" />
                    ))}
                  </div>
                  {/* today marker */}
                  {todayOffset >= 0 && todayOffset < VISIBLE_DAYS && (
                    <div
                      className="absolute top-0 bottom-0 z-[1] w-px bg-sky-400"
                      style={{ left: todayOffset * dayWidth }}
                    />
                  )}
                  {/* booking bars */}
                  {items.map((b) => {
                    const start = parseDate(b.pickup_date);
                    const end = parseDate(b.dropoff_date);
                    const rawLeft = diffDays(rangeStart, start) * dayWidth;
                    const rawWidth = (diffDays(start, end) + 1) * dayWidth;
                    const left = Math.max(0, rawLeft);
                    const clippedWidth = Math.min(rawLeft + rawWidth, timelineWidth) - left;
                    if (clippedWidth <= 0) return null;
                    const meta = STATUS_META[b.status] ?? FALLBACK_META;
                    const wide = clippedWidth > 260;
                    const medium = clippedWidth > 150;
                    return (
                      <button
                        key={b.id}
                        onClick={() => setSelected(b)}
                        title={`Booking #${b.id} · ${meta.label}`}
                        aria-label={`Booking ${b.id}, ${meta.label}, ${b.name}`}
                        style={{
                          left,
                          width: clippedWidth,
                          top: 8 + b.lane * (LANE_HEIGHT + LANE_GAP),
                          height: LANE_HEIGHT,
                        }}
                        className={`absolute z-[2] flex items-center gap-3 overflow-hidden rounded-full px-3 text-left text-white shadow-sm ring-1 ring-inset ${meta.bar} ${meta.ring} transition hover:brightness-95`}
                      >
                        {clippedWidth <= 150 ? (
                          <span className="truncate text-[10px] font-bold">{meta.label}</span>
                        ) : (
                          <>
                            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/25 text-[10px]">
                              <Info size={11} />
                            </span>
                            <span className="shrink-0 text-xs font-semibold">ID {b.id}</span>
                            <span className="shrink-0 text-[10px] font-bold">{meta.label}</span>
                          </>
                        )}
                        {medium && (
                          <span className="shrink-0 text-[11px] leading-tight opacity-95">
                            <span className="block">From: {fmtShort(b.pickup_date, b.pickup_time)}</span>
                            <span className="block">To: {fmtShort(b.dropoff_date, b.dropoff_time)}</span>
                          </span>
                        )}
                        {medium && (
                          <span className="shrink-0 text-[11px] font-medium opacity-95">
                            Total price:
                            <br />
                            AED {b.total_price.toFixed(2)}
                          </span>
                        )}
                        {wide && (
                          <span className="shrink-0 truncate text-[11px] opacity-95">
                            Driver:
                            <br />
                            {b.name}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Detail popover */}
      {selected && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900 p-5 text-slate-200 shadow-xl"
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Booking #{selected.id}
                </p>
                <p className="text-lg font-bold text-slate-100">{selected.name}</p>
                <span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-bold text-white ${STATUS_META[selected.status]?.bar ?? FALLBACK_META.bar}`}>
                  {STATUS_META[selected.status]?.label ?? FALLBACK_META.label}
                </span>
              </div>
              <button onClick={() => setSelected(null)} className="rounded p-1 text-slate-400 hover:bg-slate-800">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-medium text-slate-100">From:</span>{" "}
                {fmtShort(selected.pickup_date, selected.pickup_time)}
              </p>
              <p>
                <span className="font-medium text-slate-100">To:</span>{" "}
                {fmtShort(selected.dropoff_date, selected.dropoff_time)}
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-slate-400" /> {selected.phone}
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-slate-400" /> {selected.email}
              </p>
              {selected.baby_seat && (
                <p className="flex items-center gap-2">
                  <Baby size={14} className="text-slate-400" /> Baby seat requested
                </p>
              )}
              <p className="flex items-center gap-2">
                <CreditCard size={14} className="text-slate-400" />
                AED {selected.total_price.toFixed(2)} &middot; {selected.payment_status}
                {selected.pay_now ? " (pay now)" : " (pay later)"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}