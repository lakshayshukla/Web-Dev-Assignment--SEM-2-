import { useState, lazy, Suspense, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  stopSession, pauseTimer, resumeTimer, abandonSession, setPomodoroCount
} from '../store/sessionSlice'
import useTimer from '../hooks/useTimer'
import TimerRing from '../components/TimerRing'
import { formatDuration, MOODS } from '../utils/helpers'
import { toast } from 'react-toastify'

const StartSessionModal = lazy(() => import('../components/StartSessionModal'))
const QuickLogModal = lazy(() => import('../components/QuickLogModal'))

const SessionPage = () => {
  const dispatch = useDispatch()
  const [showStart, setShowStart] = useState(false)
  const [showLog, setShowLog] = useState(false)
  const { timerSeconds, timerRunning, activeSession, formatTime, progress, playSound } = useTimer()
  const { focusDuration, pomodoroMode } = useSelector(s => s.session)
  const { focusDuration: settingsFocus, breakDuration: settingsBreak } = useSelector(s => s.settings)

  // Pomodoro completion check
  useEffect(() => {
    if (timerSeconds === focusDuration && timerRunning && activeSession) {
      playSound('complete')
      toast.success('🎉 Pomodoro complete! Take a break.')
    }
  }, [timerSeconds, focusDuration, timerRunning, activeSession, playSound])

  const handleStop = () => {
    if (!activeSession) return
    dispatch(stopSession())
    toast.info('Session saved! Great work! 🏆')
  }

  const handleAbandon = () => {
    if (window.confirm('Abandon this session? Progress will be lost.')) {
      dispatch(abandonSession())
      toast.warning('Session abandoned.')
    }
  }

  const mood = MOODS.find(m => m.id === activeSession?.mood)

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Focus Timer
        </h1>
        <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
          {activeSession ? 'Your session is running — stay locked in.' : 'Start a session to begin tracking.'}
        </p>
      </div>

      {/* Main timer card */}
      <div className="card text-center glow-green mb-6">
        {/* Session info */}
        {activeSession && (
          <div className="mb-6 p-3 rounded-xl" style={{ background: 'var(--bg-primary)' }}>
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>Goal</p>
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  {activeSession.goal}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{mood?.emoji || '😐'}</span>
                <div className="text-right">
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Mood</p>
                  <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{mood?.label}</p>
                </div>
              </div>
            </div>
            {activeSession.tags?.length > 0 && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {activeSession.tags.map(tag => (
                  <span key={tag} className="tag" style={{
                    background: 'rgba(34,197,94,0.1)',
                    color: '#22c55e',
                    border: '1px solid rgba(34,197,94,0.2)'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Timer ring */}
        <div className="flex justify-center mb-6">
          <TimerRing progress={progress} size={240} strokeWidth={12} active={timerRunning}>
            <div className="font-display text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {formatTime(timerSeconds)}
            </div>
            {activeSession && (
              <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                {timerRunning ? '● Recording' : '⏸ Paused'}
              </div>
            )}
            {!activeSession && (
              <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                Ready
              </div>
            )}
          </TimerRing>
        </div>

        {/* Controls */}
        {!activeSession ? (
          <button onClick={() => setShowStart(true)} className="btn-primary px-10 py-3 text-base">
            🚀 Start Focus Session
          </button>
        ) : (
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => timerRunning ? dispatch(pauseTimer()) : dispatch(resumeTimer())}
              className="btn-secondary px-8 py-3"
            >
              {timerRunning ? '⏸ Pause' : '▶ Resume'}
            </button>
            <button onClick={() => setShowLog(true)} className="px-5 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316', border: '1px solid rgba(249,115,22,0.3)' }}>
              ⚠️ Log Distraction
            </button>
            <button onClick={handleStop} className="btn-primary px-8 py-3">
              ✓ Complete
            </button>
          </div>
        )}

        {activeSession && (
          <button onClick={handleAbandon} className="mt-3 text-xs transition-all"
            style={{ color: 'var(--text-secondary)' }}>
            Abandon Session
          </button>
        )}
      </div>

      {/* Session stats */}
      {activeSession && (
        <div className="grid grid-cols-3 gap-4 mb-6 animate-slide-up">
          <div className="card text-center">
            <p className="font-display text-2xl font-bold" style={{ color: '#22c55e' }}>
              {formatDuration(timerSeconds)}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Time Focused</p>
          </div>
          <div className="card text-center">
            <p className="font-display text-2xl font-bold" style={{ color: '#f97316' }}>
              {activeSession.distractionCount}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Distractions</p>
          </div>
          <div className="card text-center">
            <p className="font-display text-2xl font-bold" style={{ color: '#a855f7' }}>
              {Math.round(progress)}%
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Progress</p>
          </div>
        </div>
      )}

      {/* Tips */}
      {!activeSession && (
        <div className="card animate-fade-in">
          <h3 className="font-display font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            🧠 Tips for Deep Focus
          </h3>
          <div className="space-y-2">
            {[
              { icon: '📵', tip: 'Put your phone face down or in another room' },
              { icon: '🎧', tip: 'Use noise-cancelling headphones or brown noise' },
              { icon: '🚫', tip: 'Block distracting websites before you start' },
              { icon: '💧', tip: 'Have water nearby — dehydration kills focus' },
              { icon: '🎯', tip: 'Set a clear, specific goal for the session' },
            ].map(({ icon, tip }, i) => (
              <div key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span className="text-base mt-0.5">{icon}</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Suspense fallback={null}>
        {showStart && <StartSessionModal onClose={() => setShowStart(false)} />}
        {showLog && <QuickLogModal onClose={() => setShowLog(false)} />}
      </Suspense>
    </div>
  )
}

export default SessionPage
