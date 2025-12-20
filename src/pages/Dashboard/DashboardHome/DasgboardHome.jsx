// src/pages/Dashboard/DashboardHome/DashboardHome.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const DashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    // role-based redirect
    if (user.role === "admin") {
      navigate("/dashboard/assign-rider");
    } else if (user.role === "rider") {
      navigate("/dashboard/pending-deliveries");
    } else {
      navigate("/dashboard/myParcels");
    }
  }, [user, navigate]);

  return <p className="text-center mt-10 text-lg">Redirecting to dashboard...</p>;
};

export default DashboardHome;
