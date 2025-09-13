import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { LoginPage } from './pages/LoginPage'
import { CoursesPage } from './pages/CoursesPage'
import { SectionsPage } from './pages/SectionsPage'
import { WatchlistPage } from './pages/WatchlistPage'

function App() {
  return (
    <Router>
      <AppShell>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/sections/:courseId" element={<SectionsPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/" element={<CoursesPage />} />
        </Routes>
      </AppShell>
    </Router>
  )
}

export default App
