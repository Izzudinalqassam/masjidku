import { PrayerTimes, PrayerTimesCoordinates, CalculationMethod } from 'adhan'

// Jakarta coordinates (default)
const DEFAULT_COORDINATES: PrayerTimesCoordinates = {
    latitude: -6.2088,
    longitude: 106.8456
}

// Prayer times configuration
export const PRAYER_CONFIG = {
  coordinates: DEFAULT_COORDINATES,
  method: CalculationMethod.MuslimWorldLeague,
  madhab: 'Shafi' as const,
  highLatitudeRule: 'TwilightAngle' as const,
  polarCircleResolution: 'Unresolved' as const,
  adjustments: {
    fajr: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0
  }
}

// Prayer names in Indonesian
export const PRAYER_NAMES = {
  fajr: 'Subuh',
  dhuhr: 'Dzuhur',
  asr: 'Ashar',
  maghrib: 'Maghrib',
  isha: 'Isya'
}

export interface PrayerTime {
  name: string
  time: string
  next: boolean
  elapsed: boolean
  hours: number
  minutes: number
}

export interface TodayPrayerTimes {
  date: string
  prayers: PrayerTime[]
  nextPrayer: PrayerTime | null
  currentPrayer: PrayerTime | null
}

export function getPrayerTimesForDate(date: Date = new Date(), coordinates: PrayerTimesCoordinates = DEFAULT_COORDINATES): TodayPrayerTimes {
  const prayerTimes = new PrayerTimes({
    ...PRAYER_CONFIG,
    coordinates
  })

  const times = prayerTimes.timesForDate(date)
  
  const prayers: PrayerTime[] = [
    { name: PRAYER_NAMES.fajr, time: times.fajr, next: false, elapsed: false, hours: 0, minutes: 0 },
    { name: PRAYER_NAMES.dhuhr, time: times.dhuhr, next: false, elapsed: false, hours: 0, minutes: 0 },
    { name: PRAYER_NAMES.asr, time: times.asr, next: false, elapsed: false, hours: 0, minutes: 0 },
    { name: PRAYER_NAMES.maghrib, time: times.maghrib, next: false, elapsed: false, hours: 0, minutes: 0 },
    { name: PRAYER_NAMES.isha, time: times.isha, next: false, elapsed: false, hours: 0, minutes: 0 }
  ]

  // Parse times and determine current/next prayer
  const now = new Date()
  const currentTime = now.getHours() * 60 + now.getMinutes()
  
  prayers.forEach(prayer => {
    const [hours, minutes] = prayer.time.split(':').map(Number)
    prayer.hours = hours
    prayer.minutes = minutes
    const prayerTime = hours * 60 + minutes
    prayer.elapsed = prayerTime < currentTime
  })

  // Find next prayer
  let nextPrayer: PrayerTime | null = null
  let currentPrayer: PrayerTime | null = null
  
  for (let i = 0; i < prayers.length; i++) {
    const prayer = prayers[i]
    const prayerTime = prayer.hours * 60 + prayer.minutes
    
    if (!prayer.elapsed && !nextPrayer) {
      nextPrayer = prayer
      nextPrayer.next = true
    }
    
    if (prayer.elapsed && i < prayers.length - 1 && !prayers[i + 1].elapsed) {
      currentPrayer = prayer
    }
  }

  // Handle case where all prayers have passed
  if (!nextPrayer) {
    nextPrayer = prayers[0] // Next day's first prayer
    nextPrayer.next = true
  }

  return {
    date: date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    prayers,
    nextPrayer,
    currentPrayer
  }
}

export function getTimeUntilPrayer(prayerTime: string): string {
  const now = new Date()
  const [hours, minutes] = prayerTime.split(':').map(Number)
  
  const prayer = new Date()
  prayer.setHours(hours, minutes, 0, 0)
  
  // If prayer time has passed, set for tomorrow
  if (prayer <= now) {
    prayer.setDate(prayer.getDate() + 1)
  }
  
  const diff = prayer.getTime() - now.getTime()
  const diffHours = Math.floor(diff / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (diffHours > 0) {
    return `${diffHours} jam ${diffMinutes} menit lagi`
  } else {
    return `${diffMinutes} menit lagi`
  }
}

export function getCurrentLocation(): Promise<PrayerTimesCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      resolve(DEFAULT_COORDINATES)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      (error) => {
        console.warn('Geolocation error:', error)
        resolve(DEFAULT_COORDINATES)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  })
}
