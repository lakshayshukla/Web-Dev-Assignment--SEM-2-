import { useState, lazy, Suspense } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setFilter, setSearchQuery, setSortBy,
  deleteDistraction, selectFilteredDistractions, selectCategories
} from '../store/distractionSlice'
import { formatTimestamp, getSeverityColor } from '../utils/helpers'
import useDebounce from '../hooks/useDebounce'
import { toast } from 'react-toastify'

const QuickLogModal = lazy(() => import('../components/QuickLogModal'))

const DistractionsPage = () => {
  const dispatch = useDispatch()
  const [showLog, setShowLog] = useState(false)
  const [localSearch, setLocalSearch] = useState('')
  const filtered = useSelector(selectFilteredDistractions)
  const categories = useSelector(selectCategories)
  const { filter, sortBy, searchQuery } = useSelector(s => s.distraction)

  // Debounced search
  const debouncedSearch = useDebounce(localSearch, 350)
  // Dispatch debounced value
  if (debouncedSearch !== searchQuery) {
    dispatch(setSearchQuery(debouncedSearch))
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this distraction entry?')) {
      dispatch(deleteDistraction(id))
      toast.info('Entry deleted')
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Distractions
          </h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
            {filtered.length} entries • Track what's stealing your focus
          </p>
        </div>
        <button onClick={() => setShowLog(true)} className="btn-primary">
          + Log Distraction
        </button>
      </div>

      {/* Search + filters bar */}
      <div className="card mb-5 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            🔍
          </span>
          <input
            type="text"
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            placeholder="Search distractions..."
            className="input-field pl-9"
          />
        </div>

        {/* Category filter */}
        <select
          value={filter}
          onChange={e => dispatch(setFilter(e.target.value))}
          className="input-field w-auto"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => dispatch(setSortBy(e.target.value))}
          className="input-field w-auto"
        >
          <option value="recent">Most Recent</option>
          <option value="oldest">Oldest First</option>
          <option value="severity">By Severity</option>
        </select>
      </div>

      {/* Category filter pills */}
      <div className="flex gap-2 flex-wrap mb-5">
        <button
          onClick={() => dispatch(setFilter('all'))}
          className="tag transition-all"
          style={{
            background: filter === 'all' ? 'rgba(34,197,94,0.15)' : 'var(--bg-card)',
            color: filter === 'all' ? '#22c55e' : 'var(--text-secondary)',
            border: `1px solid ${filter === 'all' ? '#22c55e' : 'var(--border)'}`,
          }}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => dispatch(setFilter(cat.id))}
            className="tag transition-all"
            style={{
              background: filter === cat.id ? `${cat.color}20` : 'var(--bg-card)',
              color: filter === cat.id ? cat.color : 'var(--text-secondary)',
              border: `1px solid ${filter === cat.id ? cat.color : 'var(--border)'}`,
            }}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Distraction list */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-4xl mb-3">🎉</p>
          <p className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
            {localSearch ? 'No matches found' : 'No distractions logged!'}
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {localSearch ? 'Try a different search term' : 'Keep it up — you\'re staying focused!'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(d => {
            const cat = categories.find(c => c.id === d.category)
            return (
              <div key={d.id} className="card flex items-start gap-4 animate-fade-in group">
                {/* Category icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${cat?.color || '#6b7280'}20` }}>
                  {cat?.icon || '❓'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                          {cat?.label || 'Other'}
                        </span>
                        {/* Severity badge */}
                        <span className="tag text-xs" style={{
                          background: `${getSeverityColor(d.severity)}20`,
                          color: getSeverityColor(d.severity),
                        }}>
                          {d.severity}
                        </span>
                        {d.duration > 0 && (
                          <span className="tag text-xs" style={{
                            background: 'rgba(249,115,22,0.1)',
                            color: '#f97316',
                          }}>
                            {d.duration}m lost
                          </span>
                        )}
                      </div>
                      {d.description && (
                        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                          {d.description}
                        </p>
                      )}
                      {d.note && (
                        <p className="text-xs mt-1 italic" style={{ color: 'var(--text-secondary)', borderLeft: '2px solid var(--border)', paddingLeft: '8px' }}>
                          💭 {d.note}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {formatTimestamp(d.timestamp)}
                      </span>
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg flex items-center justify-center text-xs transition-all"
                        style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Suspense fallback={null}>
        {showLog && <QuickLogModal onClose={() => setShowLog(false)} />}
      </Suspense>
    </div>
  )
}

export default DistractionsPage
