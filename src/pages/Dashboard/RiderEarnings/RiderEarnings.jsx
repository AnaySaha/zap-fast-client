import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const RiderEarnings = () => {
  const axiosSecure = useAxiosSecure();

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["rider-earnings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/rider/earnings");
      return res.data;
    },
  });

  const handleCashOut = async () => {
    const confirm = await Swal.fire({
      title: "Cash Out?",
      text: "Withdraw all unpaid earnings?",
      icon: "question",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.post("/rider/cashout");
      Swal.fire(
        "Success",
        `You cashed out ৳${res.data.paidAmount}`,
        "success"
      );
      refetch();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    }
  };

  if (isLoading) return <p>Loading earnings...</p>;

  return (
    <div className="p-6 max-w-xl">
      <h2 className="text-xl font-semibold mb-4">💰 Rider Earnings</h2>

      <div className="space-y-3">
        <p>Total Deliveries: <b>{data.deliveries}</b></p>
        <p>Total Earned: <b>৳{data.total}</b></p>
        <p className="text-green-600">Paid: ৳{data.paid}</p>
        <p className="text-red-600">Unpaid: ৳{data.unpaid}</p>
      </div>

      <button
        disabled={data.unpaid === 0}
        onClick={handleCashOut}
        className="btn btn-success mt-4 w-full"
      >
        Cash Out
      </button>
    </div>
  );
};

export default RiderEarnings;
