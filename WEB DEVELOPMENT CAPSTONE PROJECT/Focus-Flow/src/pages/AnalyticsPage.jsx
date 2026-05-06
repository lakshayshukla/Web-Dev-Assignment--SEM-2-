import { useSelector, useDispatch } from 'react-redux'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { setDateRange } from '../store/statsSlice'
import { selectDistractions, selectCategories } from '../store/distractionSlice'
import { getChartData, getCategoryStats, filterByDateRange, formatDuration, getFocusScore } from '../utils/helpers'

const DATE_RANGES = [
  { id: 'today', label: 'Today' },
  { id: '7days', label: '7 Days' },
  { id: '30days', label: '30 Days' },
  { id: 'all', label: 'All Time' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl p-3 shadow-xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
      <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs" style={{ color: p.color }}>
          {p.name}: {p.value} {p.name === 'Focus Hours' ? 'h' : ''}
        </p>
      ))}
    </div>
  )
}

const AnalyticsPage = () => {
  const dispatch = useDispatch()
  const sessions = useSelector(s => s.session.sessions)
  const distractions = useSelector(selectDistractions)
  const categories = useSelector(selectCategories)
  const { dateRange } = useSelector(s => s.stats)

  const chartData = getChartData(sessions, distractions, dateRange === 'all' ? '30days' : dateRange)
  const filteredSessions = filterByDateRange(sessions, dateRange)
  const filteredDistractions = filterByDateRange(distractions, dateRange, 'timestamp')
  const categoryStats = getCategoryStats(filteredDistractions, categories)
  const focusScore = getFocusScore(filteredSessions, filteredDistractions)

  const totalFocusTime = filteredSessions.reduce((sum, s) => sum + s.duration, 0)
  const avgSession = filteredSessions.length > 0
    ? Math.floor(totalFocusTime / filteredSessions.length)
    : 0
  const totalDistracted = filteredDistractions.reduce((sum, d) => sum + (d.duration || 0), 0)

  const COLORS = ['#22c55e', '#3b82f6', '#f97316', '#a855f7', '#ef4444', '#f59e0b', '#10b981', '#6b7280']

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Analytics
          </h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
            Understand your focus patterns
          </p>
        </div>
        {/* Date range picker */}
        <div className="flex gap-1 p-1 rounded-xl border" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
          {DATE_RANGES.map(r => (
            <button
              key={r.id}
              onClick={() => dispatch(setDateRange(r.id))}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: dateRange === r.id ? '#22c55e' : 'transparent',
                color: dateRange === r.id ? 'white' : 'var(--text-secondary)',
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Focus Score', value: `${focusScore}%`, icon: '📈', color: '#22c55e' },
          { label: 'Total Focus Time', value: formatDuration(totalFocusTime), icon: '⚡', color: '#3b82f6' },
          { label: 'Sessions', value: filteredSessions.length, icon: '🎯', color: '#a855f7' },
          { label: 'Avg Session', value: formatDuration(avgSession), icon: '⏱', color: '#f97316' },
        ].map(stat => (
          <div key={stat.label} className="card">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
              style={{ background: `${stat.color}20` }}>
              {stat.icon}
            </div>
            <p className="font-display text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Focus vs Distractions chart */}
      <div className="card mb-5">
        <h3 className="font-display font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Focus Time vs Distractions
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="focusHours" name="Focus Hours" stroke="#22c55e" fill="rgba(34,197,94,0.1)" strokeWidth={2} />
            <Area type="monotone" dataKey="distractions" name="Distractions" stroke="#f97316" fill="rgba(249,115,22,0.1)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row: sessions bar + distraction pie */}
      <div className="grid grid-cols-2 gap-5">
        {/* Sessions bar chart */}
        <div className="card">
          <h3 className="font-display font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Sessions Per Day
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sessions" name="Sessions" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distraction pie */}
        <div className="card">
          <h3 className="font-display font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Distraction Breakdown
          </h3>
          {categoryStats.length === 0 ? (
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <p className="text-3xl mb-2">🏆</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No distractions!</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie
                    data={categoryStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="count"
                    nameKey="label"
                  >
                    {categoryStats.map((entry, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val, name) => [val, name]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {categoryStats.slice(0, 5).map((cat, i) => (
                  <div key={cat.id} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: COLORS[i % COLORS.length] }}>
                    </div>
                    <span className="flex-1" style={{ color: 'var(--text-primary)' }}>{cat.label}</span>
                    <span className="font-bold" style={{ color: 'var(--text-secondary)' }}>{cat.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Distraction time card */}
      {totalDistracted > 0 && (
        <div className="card mt-5 flex items-center gap-4"
          style={{ border: '1px solid rgba(249,115,22,0.2)', background: 'rgba(249,115,22,0.03)' }}>
          <span className="text-4xl">⏰</span>
          <div>
            <p className="font-display text-2xl font-bold" style={{ color: '#f97316' }}>
              {totalDistracted} minutes
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              lost to distractions in this period — that's {Math.round(totalDistracted / 60 * 10) / 10} hours you could reclaim!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnalyticsPage
