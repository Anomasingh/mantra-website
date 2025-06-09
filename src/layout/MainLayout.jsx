import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50">
        <Header />
      </header>
      <main className="pt-[70px]">
        <Outlet />
      </main>
      <footer className='bottom-0 '>
        <Footer />
      </footer>
    </>
  );
};

export default MainLayout;
