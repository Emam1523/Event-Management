import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicOnlyRoute = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-10 w-10 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
      </div>
    );
  }

  return <Outlet />;
};

export default PublicOnlyRoute;
