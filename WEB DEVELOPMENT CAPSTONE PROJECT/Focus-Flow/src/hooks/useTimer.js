import { useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { tickTimer, stopSession } from '../store/sessionSlice'

export const useTimer = () => {
  const dispatch = useDispatch()
  const { timerRunning, timerSeconds, activeSession, focusDuration } = useSelector(s => s.session)
  const { soundEnabled } = useSelector(s => s.settings)
  const intervalRef = useRef(null)

  const playSound = useCallback((type) => {
    if (!soundEnabled) return
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)

      if (type === 'tick') {
        osc.frequency.value = 800
        gain.gain.setValueAtTime(0.05, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.1)
      } else if (type === 'complete') {
        osc.frequency.value = 523.25
        gain.gain.setValueAtTime(0.3, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 1)
      } else if (type === 'distraction') {
        osc.frequency.value = 300
        osc.type = 'sawtooth'
        gain.gain.setValueAtTime(0.1, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.3)
      }
    } catch (e) {
      // Audio context not supported
    }
  }, [soundEnabled])

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        dispatch(tickTimer())
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [timerRunning, dispatch])

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const progress = Math.min((timerSeconds / focusDuration) * 100, 100)

  return {
    timerSeconds,
    timerRunning,
    activeSession,
    formatTime,
    progress,
    playSound,
  }
}

export default useTimer
