// Simple prayer times (temporary - without external library)
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

// Default prayer times (for Jakarta)
const DEFAULT_PRAYER_TIMES: PrayerTime[] = [
  { name: PRAYER_NAMES.fajr, time: '04:30', next: false, elapsed: false, hours: 4, minutes: 30 },
  { name: PRAYER_NAMES.dhuhr, time: '12:00', next: false, elapsed: false, hours: 12, minutes: 0 },
  { name: PRAYER_NAMES.asr, time: '15:15', next: false, elapsed: false, hours: 15, minutes: 15 },
  { name: PRAYER_NAMES.maghrib, time: '18:10', next: false, elapsed: false, hours: 18, minutes: 10 },
  { name: PRAYER_NAMES.isha, time: '19:25', next: false, elapsed: false, hours: 19, minutes: 25 }
]

export function getPrayerTimesForDate(date: Date = new Date()): TodayPrayerTimes {
  const prayers = [...DEFAULT_PRAYER_TIMES].map(p => ({ ...p }))
  
  // Parse times and determine current/next prayer
  const now = new Date()
  const currentTime = now.getHours() * 60 + now.getMinutes()
  
  prayers.forEach(prayer => {
    prayer.hours = prayer.hours
    prayer.minutes = prayer.minutes
    const prayerTime = prayer.hours * 60 + prayer.minutes
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
