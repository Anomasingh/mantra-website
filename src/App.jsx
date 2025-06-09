import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import MostlySearched from './pages/MostlySearched';
import DetailsPage from "./pages/DetailsPage";  
// import God_Goddess from "./pages/God_Goddess"     // General details view


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="mostly-searched" element={<MostlySearched />} />
          <Route path="/details/:id" element={<DetailsPage />} />
          {/* <Route path="/gods/:id" element={<God_Goddess/>} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
