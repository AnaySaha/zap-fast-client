import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";

const AdminRoute = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const location = useLocation();

  if (authLoading || roleLoading) {
    return <p>Loading...</p>;
  }

  if (!user || role !== "admin") {
    return (
      <Navigate
        to="/forbidden"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
};

export default AdminRoute;
