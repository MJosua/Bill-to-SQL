import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css'
import '@ionic/react/css/core.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import HomeLandingPage from './Page/LandingPage/HomeLandingPage';
import LoginPage from './Page/Login/LoginPage';
import BasePage from './Page/UserPage/BasePage';
import { setupIonicReact } from '@ionic/react';
setupIonicReact();

function App() {

  return (

    <Router>

      <Routes>
        <Route path="/" element={<HomeLandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/masterdata/produk" element={<BasePage />} />
        <Route path="/masterdata/lokasi" element={<BasePage />} />
        <Route path="/logbook" element={<BasePage />} />
        <Route path="/report" element={<BasePage />} />
        <Route path="/transaction" element={<BasePage />} />

        <Route path="*" element={<HomeLandingPage />} />
      </Routes>
    </Router>

  )
}

export default App
