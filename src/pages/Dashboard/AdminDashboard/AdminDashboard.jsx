import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  FaBox,
  FaClock,
  FaTruck,
  FaCheckCircle,
  FaMotorcycle,
} from "react-icons/fa";

const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
    <div className={`text-3xl ${color}`}>{icon}</div>
    <div>
      <p className="text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();

  const { data = {}, isLoading } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/dashboard-stats");
      return res.data;
    },
  });

  if (isLoading) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          icon={<FaBox />}
          title="Total Parcels"
          value={data.totalParcels}
          color="text-indigo-600"
        />

        <StatCard
          icon={<FaClock />}
          title="Pending Parcels"
          value={data.pendingParcels}
          color="text-yellow-600"
        />

        <StatCard
          icon={<FaTruck />}
          title="In Transit"
          value={data.inTransitParcels}
          color="text-blue-600"
        />

        <StatCard
          icon={<FaCheckCircle />}
          title="Delivered"
          value={data.deliveredParcels}
          color="text-green-600"
        />

        <StatCard
          icon={<FaMotorcycle />}
          title="Assigned Riders"
          value={data.assignedRiders}
          color="text-purple-600"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
