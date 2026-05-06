# ⚡ FocusFlow — Focus & Distraction Tracker

> A production-grade React + Redux Toolkit capstone project for tracking deep focus sessions and logging distractions with analytics.

---

## 🛠 Tech Stack

| Technology | Version | Usage |
|---|---|---|
| **React** | 18.2.0 | Frontend UI framework |
| **Vite** | 5.0.0 | Build tool & dev server |
| **Redux Toolkit** | 2.0.1 | Global state management |
| **React Router** | 6.20.0 | Client-side routing (6 routes) |
| **Axios** | 1.6.2 | API integration (quotes) |
| **Recharts** | 2.10.1 | Data visualization charts |
| **Tailwind CSS** | 3.3.5 | Utility-first styling |
| **date-fns** | 2.30.0 | Date formatting utilities |
| **uuid** | 9.0.0 | Unique session IDs |
| **react-toastify** | 9.1.3 | Toast notifications |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ → https://nodejs.org

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/focusflow.git
cd focusflow

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
focus-tracker/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── Sidebar.jsx          # Navigation sidebar with dark mode toggle
│   │   ├── TimerRing.jsx        # SVG circular animated timer
│   │   ├── StartSessionModal.jsx # Multi-step session creation form
│   │   ├── QuickLogModal.jsx    # Distraction logging form
│   │   ├── EditSessionModal.jsx # Edit existing session (CRUD)
│   │   └── ErrorBoundary.jsx   # React error boundary
│   │
│   ├── pages/                   # Page components (all lazy-loaded)
│   │   ├── Dashboard.jsx        # Overview, stats, weekly bar chart
│   │   ├── SessionPage.jsx      # Live focus timer with controls
│   │   ├── DistractionsPage.jsx # Distraction log with search/filter/sort
│   │   ├── AnalyticsPage.jsx    # Charts: Area, Bar, Pie (Recharts)
│   │   ├── HistoryPage.jsx      # Paginated session history + CRUD
│   │   └── SettingsPage.jsx     # User preferences & timer settings
│   │
│   ├── store/                   # Redux Toolkit state management
│   │   ├── store.js             # Root Redux store
│   │   ├── sessionSlice.js      # Session CRUD state + timer state
│   │   ├── distractionSlice.js  # Distraction CRUD + filtering selectors
│   │   ├── statsSlice.js        # Analytics date-range filter state
│   │   └── settingsSlice.js     # User preferences (persisted)
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useTimer.js          # Timer interval logic + Web Audio API
│   │   ├── useDebounce.js       # Debounce hook (350ms delay)
│   │   └── useQuote.js          # API quote fetcher with fallback
│   │
│   └── utils/
│       └── helpers.js           # formatDuration, filterByDateRange, getChartData, etc.
│
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

---

## ✅ Features

### Core Requirements (from SOP)
| Requirement | Implementation |
|---|---|
| React + Vite | Vite 5 setup, ES6+ throughout |
| Redux Toolkit | 4 slices: session, distraction, stats, settings |
| React Router v6 | 6 routes with Sidebar NavLink |
| API Integration | ZenQuotes via proxy + local fallback |
| Tailwind CSS | Custom CSS variables, dark/light theme |
| Lazy Loading | All 6 pages via `React.lazy` + Suspense |
| Pagination | HistoryPage: 10 sessions/page |
| Error Boundary | `<ErrorBoundary>` wraps all routes |
| Deployment Ready | Vercel/Netlify compatible |

### Advanced Features (7 of 10 implemented)
| Feature | Where |
|---|---|
| ✅ Search + Filter + Sort | DistractionsPage (debounced search, category filter, 3 sort modes) |
| ✅ Dark Mode Toggle | Sidebar + SettingsPage, persisted to localStorage |
| ✅ Dashboard with Charts | AnalyticsPage: Area chart, Bar chart, Pie chart |
| ✅ Debounced API Calls | useDebounce hook (350ms), applied to search input |
| ✅ Error Boundary | ErrorBoundary component wrapping all routes |
| ✅ Performance Optimization | Lazy loading + memoized Redux selectors |
| ✅ Multi-step Forms with Validation | StartSessionModal: goal + mood + tags; QuickLogModal: category + severity + note |

### CRUD Operations
| Entity | Create | Read | Update | Delete |
|---|---|---|---|---|
| Sessions | ✅ StartSessionModal | ✅ Dashboard, Analytics, History | ✅ EditSessionModal | ✅ HistoryPage |
| Distractions | ✅ QuickLogModal | ✅ DistractionsPage, Analytics | ✅ updateDistraction (slice) | ✅ DistractionsPage |

---

## 🌐 Deployment

### Vercel (Recommended — 1 click)
1. Push code to GitHub
2. Go to https://vercel.com → **New Project**
3. Import your GitHub repo
4. Click **Deploy** — no configuration needed

### Netlify
1. Run `npm run build`
2. Drag the `dist/` folder to https://app.netlify.com/drop

---

## 🔌 API Used

**ZenQuotes API** (via allorigins CORS proxy)
- Endpoint: `https://zenquotes.io/api/random`
- Used on: Dashboard (motivational quote card)
- Fallback: 12 curated local quotes when offline

---

## 📊 Domain

**Productivity / Human Resources**

Unique combination: Focus session tracking + distraction categorization + mood tagging + visual analytics

---

## 💾 Data Persistence

All data is saved to **localStorage** automatically:
- `focusflow_sessions` — session history
- `focusflow_distractions` — distraction log
- `focusflow_settings` — user preferences

No backend or database required.

---

## 🏗 Architecture Decisions

- **Redux Toolkit over Context API**: Chosen for scalability, devtools support, and cleaner async patterns
- **localStorage persistence**: Implemented directly in slice reducers for simplicity (no redux-persist dependency)
- **Lazy loading**: Every page is code-split, reducing initial bundle size
- **Web Audio API**: Sound effects generated programmatically — no audio file dependencies
- **CSS Variables for theming**: Allows instant dark/light switch without class re-rendering

---

Built with ❤️ for Frontend Capstone — React + Redux Toolkit
