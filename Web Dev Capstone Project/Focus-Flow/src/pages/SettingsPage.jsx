import { useDispatch, useSelector } from 'react-redux'
import {
  toggleDarkMode, toggleSound, toggleNotifications,
  setDailyGoal, setFocusDuration, setBreakDuration,
  setName, toggleMotivation
} from '../store/settingsSlice'
import { clearAllSessions } from '../store/sessionSlice'
import { clearAllDistractions } from '../store/distractionSlice'
import { toast } from 'react-toastify'

const ToggleRow = ({ label, sub, value, onToggle, icon }) => (
  <div className="flex items-center justify-between py-4 border-b" style={{ borderColor: 'var(--border)' }}>
    <div className="flex items-center gap-3">
      <span className="text-xl">{icon}</span>
      <div>
        <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{label}</p>
        {sub && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{sub}</p>}
      </div>
    </div>
    <button
      onClick={onToggle}
      className={`w-12 h-6 rounded-full transition-all relative`}
      style={{ background: value ? '#22c55e' : 'var(--border)' }}
    >
      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${value ? 'left-6' : 'left-0.5'}`}></div>
    </button>
  </div>
)

const SliderRow = ({ label, sub, value, onChange, min, max, unit, icon }) => (
  <div className="py-4 border-b" style={{ borderColor: 'var(--border)' }}>
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <div>
          <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{label}</p>
          {sub && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{sub}</p>}
        </div>
      </div>
      <span className="font-display font-bold text-lg" style={{ color: '#22c55e' }}>
        {value} {unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={e => onChange(parseInt(e.target.value))}
      className="w-full h-2 rounded-full appearance-none cursor-pointer"
      style={{ accentColor: '#22c55e', background: `linear-gradient(to right, #22c55e ${((value - min) / (max - min)) * 100}%, var(--border) 0)` }}
    />
    <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
      <span>{min} {unit}</span>
      <span>{max} {unit}</span>
    </div>
  </div>
)

const SettingsPage = () => {
  const dispatch = useDispatch()
  const settings = useSelector(s => s.settings)

  const handleClearData = () => {
    if (window.confirm('This will delete ALL your sessions and distractions. Are you sure?')) {
      dispatch(clearAllSessions())
      dispatch(clearAllDistractions())
      toast.success('All data cleared')
    }
  }

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Settings
        </h1>
        <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
          Customize your FocusFlow experience
        </p>
      </div>

      {/* Profile */}
      <div className="card mb-5">
        <h2 className="font-display font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          👤 Profile
        </h2>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>
            Your Name
          </label>
          <input
            type="text"
            value={settings.name}
            onChange={e => dispatch(setName(e.target.value))}
            className="input-field"
            placeholder="Enter your name"
            maxLength={30}
          />
        </div>
      </div>

      {/* Timer settings */}
      <div className="card mb-5">
        <h2 className="font-display font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          ⏱ Timer Settings
        </h2>
        <SliderRow
          icon="🎯"
          label="Focus Duration"
          sub="Length of a focus session"
          value={settings.focusDuration}
          onChange={v => dispatch(setFocusDuration(v))}
          min={5}
          max={90}
          unit="min"
        />
        <SliderRow
          icon="☕"
          label="Break Duration"
          sub="Length of a break"
          value={settings.breakDuration}
          onChange={v => dispatch(setBreakDuration(v))}
          min={1}
          max={30}
          unit="min"
        />
        <SliderRow
          icon="🏆"
          label="Daily Session Goal"
          sub="Target number of focus sessions per day"
          value={settings.dailyGoal}
          onChange={v => dispatch(setDailyGoal(v))}
          min={1}
          max={12}
          unit="sessions"
        />
      </div>

      {/* Preferences */}
      <div className="card mb-5">
        <h2 className="font-display font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          🎨 Preferences
        </h2>
        <ToggleRow
          icon="🌙"
          label="Dark Mode"
          sub="Dark or light theme"
          value={settings.darkMode}
          onToggle={() => dispatch(toggleDarkMode())}
        />
        <ToggleRow
          icon="🔊"
          label="Sound Effects"
          sub="Timer completion and notification sounds"
          value={settings.soundEnabled}
          onToggle={() => dispatch(toggleSound())}
        />
        <ToggleRow
          icon="🔔"
          label="Notifications"
          sub="Browser notifications for session events"
          value={settings.notifications}
          onToggle={() => dispatch(toggleNotifications())}
        />
        <ToggleRow
          icon="💡"
          label="Motivational Quotes"
          sub="Show a daily motivation quote on the dashboard"
          value={settings.showMotivation}
          onToggle={() => dispatch(toggleMotivation())}
        />
      </div>

      {/* Danger zone */}
      <div className="card border-red-500/30" style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
        <h2 className="font-display font-bold mb-2" style={{ color: '#ef4444' }}>
          ⚠️ Danger Zone
        </h2>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          These actions are permanent and cannot be undone.
        </p>
        <button onClick={handleClearData} className="btn-danger">
          🗑 Clear All Data
        </button>
      </div>

      {/* About */}
      <div className="card mt-5 text-center">
        <p className="font-display font-bold text-lg" style={{ color: '#22c55e' }}>⚡ FocusFlow</p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
          Distraction Tracker v1.0.0
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
          Built with React, Redux Toolkit, Recharts & Tailwind CSS
        </p>
        <div className="flex gap-2 justify-center mt-3 flex-wrap">
          {['React 18', 'Redux Toolkit', 'React Router', 'Recharts', 'Tailwind CSS', 'Vite'].map(tech => (
            <span key={tech} className="tag text-xs"
              style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
