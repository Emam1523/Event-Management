import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingDock from '../components/FloatingDock';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isEventDetail = location.pathname.startsWith('/events/') && location.pathname !== '/events';
  const isEventsPage = location.pathname === '/events';

  const hideNavbarPaths = ['/profile', '/my-tickets', '/dashboard', '/cart', '/checkout', '/payment-success'];
  
  const shouldHideNavbar = (isAuthenticated && (hideNavbarPaths.includes(location.pathname) || isEventsPage)) || isEventDetail;

  const userProfilePaths = ['/profile', '/my-tickets', '/dashboard'];
  const showFloatingDock = shouldHideNavbar && !userProfilePaths.includes(location.pathname) && !isEventDetail && !isEventsPage;

  return (
    <div className="min-h-screen flex flex-col">
      {!shouldHideNavbar && <Navbar />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {!shouldHideNavbar && <Footer />}
      {showFloatingDock && <FloatingDock />}
    </div>
  );
};

export default MainLayout;
