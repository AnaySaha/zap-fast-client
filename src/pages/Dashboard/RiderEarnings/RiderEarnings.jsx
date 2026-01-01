import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const RiderEarnings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    data = { total: 0, deliveries: [] },
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["rider-earnings", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/rider/earnings?email=${user.email}`
      );
      return res.data;
    },
  });

  const handleCashOut = async () => {
    const confirm = await Swal.fire({
      title: "Cash Out?",
      text: "Withdraw all unpaid earnings?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, cash out",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.post("/rider/cashout", {
        email: user.email,
      });

      Swal.fire(
        "Success",
        `You cashed out ৳${res.data.paidAmount}`,
        "success"
      );

      refetch();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Cash out failed",
        "error"
      );
    }
  };

  if (isLoading) return <p>Loading earnings...</p>;

  const totalDeliveries = data.deliveries.length;
  const unpaidAmount = data.total;

  return (
    <div className="p-6 max-w-xl">
      <h2 className="text-xl font-semibold mb-4">💰 Rider Earnings</h2>

      <div className="space-y-2">
        <p>
          Total Deliveries: <b>{totalDeliveries}</b>
        </p>
        <p>
          Total Earned: <b>৳{data.total}</b>
        </p>
        <p className="text-red-600">
          Unpaid Balance: ৳{unpaidAmount}
        </p>
      </div>

      <button
        disabled={unpaidAmount === 0}
        onClick={handleCashOut}
        className="btn btn-success mt-4 w-full"
      >
        Cash Out
      </button>
    </div>
  );
};

export default RiderEarnings;
