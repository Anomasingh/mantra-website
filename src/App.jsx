import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layout/MainLayout';

const HomePage = lazy(() => import('./pages/HomePage'));
const MantrasList = lazy(() => import('./pages/MantrasList'));
const MantraDetail = lazy(() => import('./pages/MantraDetail'));
const BlogsListing = lazy(() => import('./components/blogs/BlogsListing'));
const BlogDetail = lazy(() => import('./components/blogs/BlogDetail'));
const LegacyMantraRedirect = lazy(() => import('./pages/LegacyMantraRedirect'));

// import God_Goddess from "./pages/God_Goddess"     // General details view
function App() {
  return (
    <Router>
      <Suspense
        fallback={
          <div className="bg-[#121212] text-white min-h-screen flex items-center justify-center">
            <div className="text-lg">Loading...</div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />

            <Route path="/mantras" element={<MantrasList />} />
            <Route path="/category/:type" element={<MantrasList />} />
            <Route path="/mantras/:slug" element={<MantraDetail />} />
            <Route path="/mantras/:slug/:lang" element={<MantraDetail />} />

            <Route path="/mantra/:mantraId" element={<LegacyMantraRedirect />} />

            <Route path="/blogs" element={<BlogsListing />} />
            <Route path="/blogs/:slug" element={<BlogDetail />} />

            <Route path="*" element={<Navigate to="/" replace />} />
            {/* <Route path="/gods/:id" element={<God_Goddess/>} /> */}
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
