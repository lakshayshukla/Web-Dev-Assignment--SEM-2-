import { format, isToday, isYesterday, startOfDay, subDays, parseISO } from 'date-fns'

export const formatDuration = (seconds) => {
  if (!seconds || seconds === 0) return '0m'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export const formatShortDuration = (seconds) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export const formatTimestamp = (isoString) => {
  const date = parseISO(isoString)
  if (isToday(date)) return `Today, ${format(date, 'hh:mm a')}`
  if (isYesterday(date)) return `Yesterday, ${format(date, 'hh:mm a')}`
  return format(date, 'MMM d, hh:mm a')
}

export const filterByDateRange = (items, dateRange, dateField = 'startTime') => {
  const now = new Date()
  switch (dateRange) {
    case 'today':
      return items.filter(item => isToday(parseISO(item[dateField])))
    case '7days':
      return items.filter(item => parseISO(item[dateField]) >= subDays(now, 7))
    case '30days':
      return items.filter(item => parseISO(item[dateField]) >= subDays(now, 30))
    case 'all':
    default:
      return items
  }
}

export const groupByDay = (items, dateField = 'startTime') => {
  const groups = {}
  items.forEach(item => {
    const day = format(parseISO(item[dateField]), 'yyyy-MM-dd')
    if (!groups[day]) groups[day] = []
    groups[day].push(item)
  })
  return groups
}

export const getChartData = (sessions, distractions, dateRange) => {
  const now = new Date()
  const days = dateRange === 'today' ? 1 : dateRange === '7days' ? 7 : 30
  const data = []

  for (let i = days - 1; i >= 0; i--) {
    const day = subDays(now, i)
    const dayStr = format(day, 'yyyy-MM-dd')
    const dayLabel = i === 0 ? 'Today' : i === 1 ? 'Yesterday' : format(day, 'MMM d')

    const daySessions = sessions.filter(s =>
      format(parseISO(s.startTime), 'yyyy-MM-dd') === dayStr
    )
    const dayDistractions = distractions.filter(d =>
      format(parseISO(d.timestamp), 'yyyy-MM-dd') === dayStr
    )

    const focusMinutes = daySessions.reduce((sum, s) => sum + Math.floor(s.duration / 60), 0)

    data.push({
      date: dayLabel,
      fullDate: dayStr,
      focusMinutes,
      focusHours: parseFloat((focusMinutes / 60).toFixed(1)),
      sessions: daySessions.length,
      distractions: dayDistractions.length,
      distractionsTime: dayDistractions.reduce((sum, d) => sum + (d.duration || 0), 0),
    })
  }

  return data
}

export const getCategoryStats = (distractions, categories) => {
  return categories.map(cat => {
    const catDistractions = distractions.filter(d => d.category === cat.id)
    return {
      ...cat,
      count: catDistractions.length,
      totalTime: catDistractions.reduce((sum, d) => sum + (d.duration || 0), 0),
      percentage: distractions.length > 0
        ? Math.round((catDistractions.length / distractions.length) * 100)
        : 0,
    }
  }).filter(c => c.count > 0).sort((a, b) => b.count - a.count)
}

export const getFocusScore = (sessions, distractions) => {
  if (sessions.length === 0) return 0
  const totalFocusTime = sessions.reduce((sum, s) => sum + s.duration, 0)
  const totalDistractionTime = distractions.reduce((sum, d) => sum + (d.duration || 0) * 60, 0)
  const ratio = totalFocusTime / (totalFocusTime + totalDistractionTime + 1)
  return Math.round(ratio * 100)
}

export const getSeverityColor = (severity) => {
  switch (severity) {
    case 'high': return '#ef4444'
    case 'medium': return '#f97316'
    case 'low': return '#22c55e'
    default: return '#6b7280'
  }
}

export const MOODS = [
  { id: 'great', label: 'Great', emoji: '🚀' },
  { id: 'good', label: 'Good', emoji: '😊' },
  { id: 'neutral', label: 'Neutral', emoji: '😐' },
  { id: 'tired', label: 'Tired', emoji: '😴' },
  { id: 'stressed', label: 'Stressed', emoji: '😤' },
]

export const TAGS = [
  'Deep Work', 'Learning', 'Coding', 'Writing', 'Reading',
  'Planning', 'Review', 'Research', 'Design', 'Meeting'
]
