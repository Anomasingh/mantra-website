import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import MostlySearched from './pages/MostlySearched';
import MantrasList from './pages/MantrasList';
import MantraDetail from './pages/MantraDetail';
import ValidationDashboard from './pages/ValidationDashboard';
import ValidationDetailView from './pages/ValidationDetailView';
// import God_Goddess from "./pages/God_Goddess"     // General details view


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="mostly-searched" element={<MostlySearched />} />
          <Route path="/mantras" element={<MantrasList />} />
          <Route path="/mantra/:mantraId" element={<MantraDetail />} />
          <Route path="/validation" element={<ValidationDashboard />} />
          <Route path="/mantra/:mantraId/validate/:language" element={<ValidationDetailView />} />
          {/* <Route path="/gods/:id" element={<God_Goddess/>} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
