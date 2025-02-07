
import './styles/global.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Registration from './pages/Registration/Registration';
import Registration_Edit from './pages/Registration_Edit/Registration_Edit';
import Map from './pages/MapPage/MapPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/registration" element={<Registration />} />
        <Route path="/edit" element={<Registration_Edit />} />
        <Route path="/map" element={<Map/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
