import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logDistraction } from '../store/distractionSlice'
import { incrementDistractionInSession } from '../store/sessionSlice'
import { toast } from 'react-toastify'

const CATEGORIES = [
  { id: 'social', label: 'Social Media', icon: '📱' },
  { id: 'messaging', label: 'Messaging', icon: '💬' },
  { id: 'news', label: 'News', icon: '📰' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎮' },
  { id: 'food', label: 'Food / Drink', icon: '☕' },
  { id: 'people', label: 'People', icon: '👥' },
  { id: 'thoughts', label: 'Thoughts', icon: '💭' },
  { id: 'other', label: 'Other', icon: '❓' },
]

const QuickLogModal = ({ onClose }) => {
  const dispatch = useDispatch()
  const { activeSession } = useSelector(s => s.session)
  const [selected, setSelected] = useState(null)
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState(5)
  const [severity, setSeverity] = useState('medium')
  const [note, setNote] = useState('')

  const handleLog = () => {
    if (!selected) {
      toast.error('Please select a category')
      return
    }
    dispatch(logDistraction({
      category: selected,
      description,
      duration,
      severity,
      note,
      sessionId: activeSession?.id || null,
    }))
    if (activeSession) {
      dispatch(incrementDistractionInSession())
    }
    toast.success('Distraction logged! Stay focused 💪')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="card w-full max-w-md animate-slide-up" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              Log Distraction
            </h2>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              What pulled you away?
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all hover:opacity-70"
            style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>
            ✕
          </button>
        </div>

        {/* Category selection */}
        <div className="mb-4">
          <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>
            Category *
          </label>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelected(cat.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all text-xs ${
                  selected === cat.id
                    ? 'border-green-500 bg-green-500/10 text-green-500'
                    : 'border-transparent hover:border-opacity-50'
                }`}
                style={{
                  borderColor: selected === cat.id ? '#22c55e' : 'var(--border)',
                  backgroundColor: selected === cat.id ? 'rgba(34,197,94,0.1)' : 'var(--bg-primary)',
                  color: selected === cat.id ? '#22c55e' : 'var(--text-secondary)',
                }}
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="text-center leading-tight">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>
            Description (optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="input-field"
            placeholder="e.g., Checked Instagram for 10 minutes..."
          />
        </div>

        {/* Duration + Severity row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>
              Time Lost (min)
            </label>
            <input
              type="number"
              min={1}
              max={120}
              value={duration}
              onChange={e => setDuration(parseInt(e.target.value) || 1)}
              className="input-field"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>
              Severity
            </label>
            <select
              value={severity}
              onChange={e => setSeverity(e.target.value)}
              className="input-field"
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>
        </div>

        {/* Note */}
        <div className="mb-5">
          <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>
            Note to self (optional)
          </label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={2}
            className="input-field resize-none"
            placeholder="What triggered this? How to avoid next time?"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleLog} className="btn-primary flex-1">
            Log It
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuickLogModal
