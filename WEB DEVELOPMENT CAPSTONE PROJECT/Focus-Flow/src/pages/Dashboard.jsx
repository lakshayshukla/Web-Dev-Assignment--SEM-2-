import { useState, lazy, Suspense } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { formatDuration, filterByDateRange, getFocusScore, getCategoryStats } from '../utils/helpers'
import { selectDistractions, selectCategories } from '../store/distractionSlice'
import useQuote from '../hooks/useQuote'
import useTimer from '../hooks/useTimer'
import { format } from 'date-fns'

const StartSessionModal = lazy(() => import('../components/StartSessionModal'))
const QuickLogModal = lazy(() => import('../components/QuickLogModal'))

const StatCard = ({ icon, label, value, sub, color, trend }) => (
  <div className="stat-card animate-fade-in">
    <div className="flex items-start justify-between">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
        style={{ background: `${color}20` }}>
        {icon}
      </div>
      {trend !== undefined && (
        <span className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{
            background: trend >= 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
            color: trend >= 0 ? '#22c55e' : '#ef4444',
          }}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div>
      <p className="text-2xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
        {value}
      </p>
      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{sub}</p>}
    </div>
  </div>
)

const Dashboard = () => {
  const [showStart, setShowStart] = useState(false)
  const [showLog, setShowLog] = useState(false)
  const sessions = useSelector(s => s.session.sessions)
  const distractions = useSelector(selectDistractions)
  const categories = useSelector(selectCategories)
  const { dailyGoal, name } = useSelector(s => s.settings)
  const { activeSession, timerSeconds, timerRunning, formatTime } = useTimer()
  const { quote, loading: quoteLoading, refetch } = useQuote()

  const todaySessions = filterByDateRange(sessions, 'today')
  const todayDistractions = filterByDateRange(distractions, 'today', 'timestamp')
  const weekSessions = filterByDateRange(sessions, '7days')

  const totalFocusToday = todaySessions.reduce((sum, s) => sum + s.duration, 0)
  const totalFocusWeek = weekSessions.reduce((sum, s) => sum + s.duration, 0)
  const focusScore = getFocusScore(weekSessions, filterByDateRange(distractions, '7days', 'timestamp'))
  const categoryStats = getCategoryStats(todayDistractions, categories)

  const goalProgress = Math.min((todaySessions.length / dailyGoal) * 100, 100)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {greeting}, {name}! 👋
          </h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
            {format(new Date(), 'EEEE, MMMM d')} — Let's make today count.
          </p>
        </div>
        <div className="flex gap-3">
          {!activeSession ? (
            <button onClick={() => setShowStart(true)} className="btn-primary">
              🚀 Start Session
            </button>
          ) : (
            <Link to="/session" className="btn-primary">
              ⚡ View Session
            </Link>
          )}
          <button onClick={() => setShowLog(true)} className="btn-secondary">
            ⚠️ Log Distraction
          </button>
        </div>
      </div>

      {/* Active session banner */}
      {activeSession && (
        <div className="mb-6 p-4 rounded-2xl border flex items-center justify-between animate-slide-up"
          style={{ border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.05)' }}>
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <div>
              <p className="font-semibold text-sm" style={{ color: '#22c55e' }}>Focus Session Active</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {activeSession.goal}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-display text-2xl font-bold" style={{ color: '#22c55e' }}>
              {formatTime(timerSeconds)}
            </span>
            <Link to="/session" className="btn-primary text-sm py-2 px-4">
              Manage →
            </Link>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          icon="⚡"
          label="Focus Time Today"
          value={formatDuration(totalFocusToday)}
          sub={`${todaySessions.length} sessions`}
          color="#22c55e"
        />
        <StatCard
          icon="🎯"
          label="Daily Goal"
          value={`${todaySessions.length}/${dailyGoal}`}
          sub={`${Math.round(goalProgress)}% complete`}
          color="#3b82f6"
        />
        <StatCard
          icon="⚠️"
          label="Distractions Today"
          value={todayDistractions.length}
          sub={`${todayDistractions.reduce((s, d) => s + (d.duration || 0), 0)}m lost`}
          color="#f97316"
        />
        <StatCard
          icon="📈"
          label="Focus Score"
          value={`${focusScore}%`}
          sub="This week"
          color="#a855f7"
        />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Daily goal progress */}
        <div className="card col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold" style={{ color: 'var(--text-primary)' }}>
              Weekly Overview
            </h3>
            <Link to="/analytics" className="text-xs" style={{ color: '#22c55e' }}>
              Full Analytics →
            </Link>
          </div>
          {/* Simple week bars */}
          <div className="flex items-end gap-2 h-24">
            {Array.from({ length: 7 }).map((_, i) => {
              const dayOffset = 6 - i
              const d = new Date()
              d.setDate(d.getDate() - dayOffset)
              const dayStr = format(d, 'yyyy-MM-dd')
              const daySessions = sessions.filter(s =>
                format(new Date(s.startTime), 'yyyy-MM-dd') === dayStr
              )
              const totalMin = daySessions.reduce((sum, s) => sum + Math.floor(s.duration / 60), 0)
              const maxMin = 240
              const heightPct = Math.min((totalMin / maxMin) * 100, 100)
              const isToday = dayOffset === 0

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-lg transition-all relative"
                    style={{
                      height: `${Math.max(heightPct, 4)}%`,
                      background: isToday
                        ? 'linear-gradient(to top, #22c55e, #4ade80)'
                        : 'var(--border)',
                      minHeight: '4px',
                    }}>
                  </div>
                  <span className="text-xs" style={{ color: isToday ? '#22c55e' : 'var(--text-secondary)' }}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()]}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="mt-3 flex gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span>⚡ {formatDuration(totalFocusWeek)} focused this week</span>
            <span>📅 {weekSessions.length} sessions</span>
          </div>
        </div>

        {/* Today's distractions */}
        <div className="card">
          <h3 className="font-display font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Top Distractions
          </h3>
          {categoryStats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-24 text-center">
              <p className="text-2xl mb-1">✅</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                No distractions today!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {categoryStats.slice(0, 4).map(cat => (
                <div key={cat.id} className="flex items-center gap-2">
                  <span className="text-base">{cat.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span style={{ color: 'var(--text-primary)' }}>{cat.label}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{cat.count}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${cat.percentage}%`, background: cat.color }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quote card */}
      {quote && (
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.05), rgba(168,85,247,0.05))' }}>
          <div className="flex items-start gap-4">
            <span className="text-3xl">💡</span>
            <div className="flex-1">
              <p className="font-medium italic" style={{ color: 'var(--text-primary)' }}>
                "{quote.content}"
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                — {quote.author}
              </p>
            </div>
            <button onClick={refetch} disabled={quoteLoading}
              className="text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{ color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>
              {quoteLoading ? '...' : '↺ New'}
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <Suspense fallback={null}>
        {showStart && <StartSessionModal onClose={() => setShowStart(false)} />}
        {showLog && <QuickLogModal onClose={() => setShowLog(false)} />}
      </Suspense>
    </div>
  )
}

export default Dashboard
