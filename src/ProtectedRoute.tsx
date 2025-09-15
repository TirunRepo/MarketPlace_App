// ProtectedRoute.tsx
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Loading from "./common/Loading";

const ProtectedRoute = () => {
  const { isAuth, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />; // center spinner only while checking auth
  }

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
