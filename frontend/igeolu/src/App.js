import './styles/global.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DesktopLive from './pages/DesktopLivePage/DesktopLive'
import DesktopHome from './pages/DesktopHomePage/DesktopHome'
import Make from './pages/MobileLivePage/Make'
import MobileMainPage from './pages/MobileMainPage/MobileMainPage'
import MobileCalendarPage from './pages/MobileCalendarPage/MobileCalendarPage'
import MobileMyPage from './pages/MobileMyPage/MobileMyPage'
import MobileLivePage from './pages/MobileLivePage/MobileLivePage'
import MobileRegisterPage from './pages/MobileRegisterPage/MobileRegisterPage'
import MobileEditPage from './pages/MobileEditPage/MobileEditPage'
import MobileEstateList from './pages/MobileEstateList/MobileEstateList'
import MobileLiveSettingPage from './pages/MobileLiveSettingPage/MobileLiveSettingPage'
import DesktopRoomSearchPage from './pages/DesktopRoomSearchPage/DesktopRoomSearchPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DesktopHome />} />
        <Route path="/live" element={<DesktopLive />} />
        <Route path="/make" element={<Make />} />
        <Route path="/mobile-main" element={<MobileMainPage />} />
        <Route path="/mobile-calendar" element={<MobileCalendarPage />} />
        <Route path="/mobile-my-page" element={<MobileMyPage />} />
        <Route path="/mobile-live" element={<MobileLivePage />} />
        <Route path="/mobile-register" element={<MobileRegisterPage />} />
        <Route path="/mobile-edit" element={<MobileEditPage />} />
        <Route path="/mobile-estate-list" element={<MobileEstateList />} />
        <Route path="/mobile-live-setting" element={<MobileLiveSettingPage />} />
        <Route path="/desktop-room-search" element={<DesktopRoomSearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
