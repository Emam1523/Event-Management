import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const MainLayout = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  const isEventDetail =
    location.pathname.startsWith("/events/") && location.pathname !== "/events";
  const isEventsPage = location.pathname === "/events";

  const hideNavbarPaths = [
    "/profile",
    "/my-tickets",
    "/cart",
    "/checkout",
    "/payment-success",
  ];

  const shouldHideNavbar =
    (isAuthenticated &&
      (hideNavbarPaths.includes(location.pathname) || isEventsPage)) ||
    isEventDetail;

  const shouldHideFooter = isAuthenticated && isAdmin;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar hideMenu={shouldHideNavbar} />
      <main className="grow">
        <Outlet />
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
