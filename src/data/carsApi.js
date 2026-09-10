import { API_BASE_URL } from "@/config"

const parseJsonValue = (value, fallback) => {
    if (typeof value !== "string") return value || fallback

    try {
        return JSON.parse(value)
    } catch {
        return fallback
    }
}

export const normalizeCar = (car) => ({
    ...car,
    priceDay: parseFloat(car.price_day || car.priceDay || 0),
    priceWeek: parseFloat(car.price_week || car.priceWeek || 0),
    priceMonth: parseFloat(car.price_month || car.priceMonth || 0),
    mileageLimit: car.mileage_limit ?? car.mileageLimit ?? 0,
    additionalMileage: parseFloat(car.additional_mileage || car.additionalMileage || 0),
    minRental: car.min_rental ?? car.minRental ?? 1,
    image: car.image?.startsWith("http") ? car.image : `${API_BASE_URL}${car.image || ""}`,
    specs: parseJsonValue(car.specs, {}),
    overview: parseJsonValue(car.overview, {}),
    features: {
        interior: [],
        exterior: [],
        safety: [],
        infotainment: [],
        comfort: [],
        ...parseJsonValue(car.features, {}),
    },
})

export const fetchCars = async () => {
    const response = await fetch(`${API_BASE_URL}/api/cars/`)

    if (!response.ok) {
        throw new Error("Failed to fetch cars.")
    }

    const data = await response.json()
    const cars = Array.isArray(data) ? data : data.results || []
    return cars.map(normalizeCar)
}
