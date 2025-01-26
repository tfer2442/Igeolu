import './styles/global.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DesktopLive from './pages/DesktopLivePage/DesktopLive'
import DesktopHome from './pages/DesktopHomePage/DesktopHome'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DesktopHome />} />
        <Route path="/live" element={<DesktopLive />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
