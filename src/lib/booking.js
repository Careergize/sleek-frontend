export function bookingDateTime(date, time) {
    const match = /^(\d{2}):(\d{2}) (AM|PM)$/.exec(time)
    if (!date || !match) return NaN
    const hour = Number(match[1]) % 12 + (match[3] === "PM" ? 12 : 0)
    return Date.parse(`${date}T${String(hour).padStart(2, "0")}:${match[2]}:00+04:00`)
}

export function normalizeBookingPhone(phone) {
    const digits = phone.replace(/[\s()+-]/g, "")
    const local = digits.replace(/^(?:00971|971|0)/, "")
    return /^5\d{8}$/.test(local) ? `+971${local}` : null
}

export function validateBooking(details, now = Date.now()) {
    const errors = []
    const pickup = bookingDateTime(details.pickupDate, details.pickupTime)
    const dropoff = bookingDateTime(details.dropoffDate, details.dropoffTime)
    if (!details.pickupDate) errors.push("Select a pickup date.")
    if (!details.dropoffDate) errors.push("Select a drop-off date.")
    if (!details.pickupTime) errors.push("Select a pickup time.")
    if (!details.dropoffTime) errors.push("Select a drop-off time.")
    if (Number.isFinite(pickup) && pickup <= now) errors.push("Pickup must be in the future (Dubai time).")
    if (Number.isFinite(pickup) && Number.isFinite(dropoff) && dropoff - pickup < 24 * 3600000) errors.push("Your rental must be at least 1 day (24 hours); drop-off must follow pickup.")
    if (details.name.trim().length < 2 || details.name.trim().length > 255) errors.push("Enter your full name (2–255 characters).")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) errors.push("Enter a valid email address.")
    if (!normalizeBookingPhone(details.phone)) errors.push("Enter a valid UAE mobile number, such as 50 123 4567 or +971 50 123 4567.")
    return errors
}

export function bookingPrice(car, details) {
    const duration = bookingDateTime(details.dropoffDate, details.dropoffTime) - bookingDateTime(details.pickupDate, details.pickupTime)
    const days = Number.isFinite(duration) ? Math.max(1, Math.ceil(duration / 86400000)) : 1
    const base = Number(car.priceDay) * days + (details.babySeat ? 25 * days : 0)
    const discount = base * 0.05
    const vat = (base - discount) * 0.05
    const total = Math.round((base - discount + vat + Number.EPSILON) * 100) / 100
    const upfront = Math.round((total / 2 + Number.EPSILON) * 100) / 100
    return { days, base, discount, vat, total, upfront }
}
