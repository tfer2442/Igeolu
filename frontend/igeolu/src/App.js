import './styles/global.css'
import { Routes, Route } from 'react-router-dom'
import DesktopLive from './pages/DesktopLivePage/DesktopLive'
import DesktopHome from './pages/DesktopHomePage/DesktopHome'
import Make from './pages/MobileLivePage/Make'
import MobileMainPage from './pages/MobileMainPage/MobileMainPage'
import MobileCalendarPage from './pages/MobileCalendarPage/MobileCalendarPage'
import MobileMyPage from './pages/MobileMyPage/MobileMyPage'
import MobileLivePage from './pages/MobileLivePage/MobileLivePage'

function App() {
  return (
      <Routes>
        <Route path="/" element={<DesktopHome />} />
        <Route path="/live" element={<DesktopLive />} />
        <Route path="/make" element={<Make />} />
        <Route path="/mobile-main" element={<MobileMainPage />} />
        <Route path="/mobile-calendar" element={<MobileCalendarPage />} />
        <Route path="/mobile-my-page" element={<MobileMyPage />} />
        <Route path="/mobile-live" element={<MobileLivePage />} />
      </Routes>
  );
}
export default App;
