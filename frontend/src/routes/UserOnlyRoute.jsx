import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserOnlyRoute = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="h-10 w-10 rounded-full border-2 border-slate-300 border-t-brand-orange animate-spin" />
      </div>
    );
  }

  // Admins are not allowed in the user/public frontend area
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default UserOnlyRoute;
