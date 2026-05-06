import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { startSession } from '../store/sessionSlice'
import { MOODS, TAGS } from '../utils/helpers'
import { toast } from 'react-toastify'

const StartSessionModal = ({ onClose }) => {
  const dispatch = useDispatch()
  const [goal, setGoal] = useState('')
  const [selectedMood, setSelectedMood] = useState('neutral')
  const [selectedTags, setSelectedTags] = useState([])

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleStart = () => {
    if (!goal.trim()) {
      toast.error('Please set a goal for this session')
      return
    }
    dispatch(startSession({ goal: goal.trim(), mood: selectedMood, tags: selectedTags }))
    toast.success('🚀 Focus session started!')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="card w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              New Focus Session
            </h2>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              Set your intention before you begin
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>
            ✕
          </button>
        </div>

        {/* Goal */}
        <div className="mb-4">
          <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>
            What's your goal? *
          </label>
          <input
            autoFocus
            type="text"
            value={goal}
            onChange={e => setGoal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleStart()}
            className="input-field"
            placeholder="e.g., Complete Chapter 3 of React course..."
            maxLength={100}
          />
          <p className="text-xs mt-1 text-right" style={{ color: 'var(--text-secondary)' }}>
            {goal.length}/100
          </p>
        </div>

        {/* Mood */}
        <div className="mb-4">
          <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>
            How are you feeling?
          </label>
          <div className="flex gap-2">
            {MOODS.map(mood => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl border transition-all`}
                style={{
                  borderColor: selectedMood === mood.id ? '#22c55e' : 'var(--border)',
                  backgroundColor: selectedMood === mood.id ? 'rgba(34,197,94,0.1)' : 'var(--bg-primary)',
                }}
              >
                <span className="text-xl">{mood.emoji}</span>
                <span className="text-xs" style={{ color: selectedMood === mood.id ? '#22c55e' : 'var(--text-secondary)' }}>
                  {mood.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="mb-5">
          <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>
            Tags (optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`tag transition-all`}
                style={{
                  backgroundColor: selectedTags.includes(tag) ? 'rgba(34,197,94,0.15)' : 'var(--bg-primary)',
                  color: selectedTags.includes(tag) ? '#22c55e' : 'var(--text-secondary)',
                  border: `1px solid ${selectedTags.includes(tag) ? '#22c55e' : 'var(--border)'}`,
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleStart} className="btn-primary flex-1">
            🚀 Start Session
          </button>
        </div>
      </div>
    </div>
  )
}

export default StartSessionModal
