import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingDock from '../components/FloatingDock';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Paths where we hide the main Navbar & Footer if the user is authenticated
  const hideNavbarPaths = ['/profile', '/my-tickets', '/dashboard', '/events', '/cart', '/checkout', '/payment-success'];
  
  const shouldHideNavbar = isAuthenticated && (
    hideNavbarPaths.includes(location.pathname) || 
    location.pathname.startsWith('/events/')
  );

  const userProfilePaths = ['/profile', '/my-tickets', '/dashboard'];
  const showFloatingDock = shouldHideNavbar && !userProfilePaths.includes(location.pathname);

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
