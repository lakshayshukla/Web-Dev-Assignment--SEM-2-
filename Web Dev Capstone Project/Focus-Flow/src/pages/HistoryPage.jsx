import { useState, lazy, Suspense } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteSession, clearAllSessions } from '../store/sessionSlice'
import { formatDuration, formatTimestamp, MOODS } from '../utils/helpers'
import { toast } from 'react-toastify'

const EditSessionModal = lazy(() => import('../components/EditSessionModal'))

const PAGE_SIZE = 10

const HistoryPage = () => {
  const dispatch = useDispatch()
  const sessions = useSelector(s => s.session.sessions)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState('all')
  const [editingSession, setEditingSession] = useState(null)

  const filtered = filter === 'all' ? sessions : sessions.filter(s => s.mood === filter)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleDelete = (id) => {
    if (window.confirm('Delete this session?')) {
      dispatch(deleteSession(id))
      toast.info('Session deleted')
    }
  }

  const handleClearAll = () => {
    if (window.confirm('Clear ALL session history? This cannot be undone.')) {
      dispatch(clearAllSessions())
      toast.info('All sessions cleared')
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Session History
          </h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
            {sessions.length} sessions recorded
          </p>
        </div>
        {sessions.length > 0 && (
          <button onClick={handleClearAll} className="btn-danger text-sm py-2">
            🗑 Clear All
          </button>
        )}
      </div>

      {/* Mood filter */}
      <div className="flex gap-2 flex-wrap mb-5">
        <button
          onClick={() => { setFilter('all'); setPage(1) }}
          className="tag transition-all"
          style={{
            background: filter === 'all' ? 'rgba(34,197,94,0.15)' : 'var(--bg-card)',
            color: filter === 'all' ? '#22c55e' : 'var(--text-secondary)',
            border: `1px solid ${filter === 'all' ? '#22c55e' : 'var(--border)'}`,
          }}
        >
          All Moods
        </button>
        {MOODS.map(mood => (
          <button
            key={mood.id}
            onClick={() => { setFilter(mood.id); setPage(1) }}
            className="tag transition-all"
            style={{
              background: filter === mood.id ? 'rgba(34,197,94,0.15)' : 'var(--bg-card)',
              color: filter === mood.id ? '#22c55e' : 'var(--text-secondary)',
              border: `1px solid ${filter === mood.id ? '#22c55e' : 'var(--border)'}`,
            }}
          >
            {mood.emoji} {mood.label}
          </button>
        ))}
      </div>

      {/* Sessions list */}
      {paginated.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
            No sessions yet
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Complete your first focus session to see it here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginated.map((session) => {
            const mood = MOODS.find(m => m.id === session.mood)
            return (
              <div key={session.id} className="card flex items-start gap-4 group animate-fade-in">
                {/* Mood + Duration */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <span className="text-2xl">{mood?.emoji || '😐'}</span>
                  <span className="font-display text-xs font-bold" style={{ color: '#22c55e' }}>
                    {formatDuration(session.duration)}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                        {session.goal}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        {formatTimestamp(session.startTime)}
                      </p>
                    </div>
                    {/* CRUD: Edit + Delete buttons */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => setEditingSession(session)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                        style={{ color: '#3b82f6', background: 'rgba(59,130,246,0.1)' }}
                        title="Edit session"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(session.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                        style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}
                        title="Delete session"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Tags + stats */}
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {session.tags?.map(tag => (
                      <span key={tag} className="tag text-xs"
                        style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>
                        {tag}
                      </span>
                    ))}
                    {session.distractionCount > 0 && (
                      <span className="tag text-xs"
                        style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316' }}>
                        ⚠️ {session.distractionCount} distractions
                      </span>
                    )}
                  </div>
                </div>

                {/* Duration display */}
                <div className="text-right flex-shrink-0">
                  <p className="font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                    {formatDuration(session.duration)}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {Math.round(session.duration / 60)} min
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary py-2 px-4 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="w-9 h-9 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: page === p ? '#22c55e' : 'var(--bg-card)',
                  color: page === p ? 'white' : 'var(--text-secondary)',
                  border: `1px solid ${page === p ? '#22c55e' : 'var(--border)'}`,
                }}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-secondary py-2 px-4 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}

      {/* Summary */}
      {sessions.length > 0 && (
        <div className="card mt-5 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="font-display text-xl font-bold" style={{ color: '#22c55e' }}>
              {formatDuration(sessions.reduce((sum, s) => sum + s.duration, 0))}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Total Focus Time</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-bold" style={{ color: '#3b82f6' }}>
              {sessions.length}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Total Sessions</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-bold" style={{ color: '#a855f7' }}>
              {formatDuration(Math.floor(sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length))}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Avg Session</p>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Suspense fallback={null}>
        {editingSession && (
          <EditSessionModal
            session={editingSession}
            onClose={() => setEditingSession(null)}
          />
        )}
      </Suspense>
    </div>
  )
}

export default HistoryPage
