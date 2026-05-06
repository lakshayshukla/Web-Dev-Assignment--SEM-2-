import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Sidebar from './components/Sidebar'
import ErrorBoundary from './components/ErrorBoundary'

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'))
const SessionPage = lazy(() => import('./pages/SessionPage'))
const DistractionsPage = lazy(() => import('./pages/DistractionsPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const HistoryPage = lazy(() => import('./pages/HistoryPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-96">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-t-green-500 animate-spin"
        style={{ borderColor: 'var(--border)', borderTopColor: '#22c55e' }}></div>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading...</p>
    </div>
  </div>
)

function App() {
  const { darkMode } = useSelector(s => s.settings)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
    }
  }, [darkMode])

  return (
    <div className="min-h-screen noise-overlay" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar />
      <main className="ml-60 p-8 min-h-screen">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/session" element={<SessionPage />} />
              <Route path="/distractions" element={<DistractionsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  )
}

export default App
