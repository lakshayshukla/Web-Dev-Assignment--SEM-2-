const TimerRing = ({ progress = 0, size = 220, strokeWidth = 10, children, active }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className={`absolute inset-0 -rotate-90 ${active ? 'timer-active' : ''}`}
        viewBox={`0 0 ${size} ${size}`}
      >
        
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progress >= 100 ? '#22c55e' : active ? '#22c55e' : 'var(--border)'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease',
            filter: active ? 'drop-shadow(0 0 8px rgba(34,197,94,0.6))' : 'none',
          }}
        />
      </svg>
      <div className="relative z-10 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  )
}

export default TimerRing
