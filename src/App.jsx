import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import MantrasList from './pages/MantrasList';
import MantraDetail from './pages/MantraDetail';
import BlogsListing from './components/blogs/BlogsListing';
import BlogDetail from './components/blogs/BlogDetail';

// import God_Goddess from "./pages/God_Goddess"     // General details view
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/mantras" element={<MantrasList />} />
          <Route path="/category/:type" element={<MantrasList />} />
          <Route path="/mantra/:mantraId" element={<MantraDetail />} />
          <Route path="/blogs" element={<BlogsListing />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          {/* <Route path="/gods/:id" element={<God_Goddess/>} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
