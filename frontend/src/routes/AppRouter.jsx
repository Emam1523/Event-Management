import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import UserOnlyRoute from "./UserOnlyRoute";

// Public Pages
import Home from "../pages/Home";
import Events from "../pages/Events";
import EventDetail from "../pages/EventDetail";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import NotFound from "../pages/NotFound";
import Contact from "../pages/public/Contact";
import TermsOfService from "../pages/public/TermsOfService";
import PrivacyPolicy from "../pages/public/PrivacyPolicy";
import RefundReturnPolicy from "../pages/public/RefundReturnPolicy";
import About from "../pages/public/About";
import Assistant from "../pages/public/Assistant";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";

// User Pages
import UserProfile from "../pages/user/UserProfile";
import MyTickets from "../pages/user/MyTickets";
import PaymentSuccess from "../pages/user/PaymentSuccess";
import PaymentFailed from "../pages/user/PaymentFailed";
import PaymentCancelled from "../pages/user/PaymentCancelled";
import TicketDetail from "../pages/user/TicketDetail";
import UserNotifications from "../pages/user/UserNotifications";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import CreateEvent from "../pages/admin/CreateEvent";
import ManageEvents from "../pages/admin/ManageEvents";
import EditEvent from "../pages/admin/EditEvent";
import Analytics from "../pages/admin/Analytics";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageBookings from "../pages/admin/ManageBookings";
import AdminReviews from "../pages/admin/AdminReviews";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public/User Routes */}
      <Route element={<MainLayout />}>
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsOfService />} />
          <Route
            path="/refund-return-policy"
            element={<RefundReturnPolicy />}
          />
        </Route>

        {/* User Only Area */}
        <Route element={<UserOnlyRoute />}>
          <Route path="/cart" element={<Cart />} />

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/my-tickets/:id" element={<TicketDetail />} />
            <Route path="/notifications" element={<UserNotifications />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failed" element={<PaymentFailed />} />
            <Route path="/payment-cancelled" element={<PaymentCancelled />} />
          </Route>
        </Route>
      </Route>

      {/* Protected Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute adminOnly />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="manage-events" element={<ManageEvents />} />
          <Route path="edit-event/:id" element={<EditEvent />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-bookings" element={<ManageBookings />} />
          <Route path="reviews" element={<AdminReviews />} />
        </Route>
      </Route>

      {/* 404 Route */}
      <Route element={<MainLayout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
