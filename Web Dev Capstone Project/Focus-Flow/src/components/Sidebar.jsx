import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleDarkMode } from '../store/settingsSlice'

const NAV_ITEMS = [
  { path: '/', icon: '⚡', label: 'Dashboard' },
  { path: '/session', icon: '🎯', label: 'Focus Timer' },
  { path: '/distractions', icon: '⚠️', label: 'Distractions' },
  { path: '/analytics', icon: '📊', label: 'Analytics' },
  { path: '/history', icon: '📋', label: 'History' },
  { path: '/settings', icon: '⚙️', label: 'Settings' },
]

const Sidebar = () => {
  const dispatch = useDispatch()
  const { darkMode, name } = useSelector(s => s.settings)
  const { activeSession } = useSelector(s => s.session)

  return (
    <aside className="fixed left-0 top-0 h-full w-60 flex flex-col border-r z-50"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)' }}>

      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
            ⚡
          </div>
          <div>
            <h1 className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              FocusFlow
            </h1>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Distraction Tracker
            </p>
          </div>
        </div>
      </div>

     
      {activeSession && (
        <div className="mx-3 mt-3 px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2"
          style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Session Active
        </div>
      )}

  
      <nav className="flex-1 p-3 space-y-1 mt-2">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

     
      <div className="p-4 border-t space-y-3" style={{ borderColor: 'var(--border)' }}>
      
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all"
          style={{ color: 'var(--text-secondary)' }}
        >
          <span className="text-sm">{darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
          <div className={`w-10 h-5 rounded-full transition-all relative ${darkMode ? 'bg-green-500' : 'bg-gray-300'}`}>
            <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${darkMode ? 'left-5' : 'left-0.5'}`}></div>
          </div>
        </button>

    
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white' }}>
            {name?.charAt(0)?.toUpperCase() || 'F'}
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{name}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Stay focused!</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
