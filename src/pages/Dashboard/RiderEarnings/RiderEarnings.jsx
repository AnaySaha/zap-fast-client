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
  const { value: amount } = await Swal.fire({
    title: "Cash Out",
    input: "number",
    inputLabel: "Enter amount to cash out",
    inputPlaceholder: "৳ amount",
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value || value <= 0) return "Enter a valid amount";
      if (value > data.unpaid) return "Amount exceeds unpaid balance";
      return null;
    },
  });

  if (!amount) return;

  try {
    const res = await axiosSecure.post("/rider/cashout", {
      amount: Number(amount),
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

  

//   const handleCashOut = async () => {
//   const { value: amount } = await Swal.fire({
//     title: "Cash Out",
//     input: "number",
//     inputLabel: "Enter amount",
//     inputAttributes: {
//       min: 1,
//     },
//     showCancelButton: true,
//   });

//   if (!amount) return;

//   if (Number(amount) > data.total) {
//     return Swal.fire(
//       "Error",
//       "Amount cannot be greater than unpaid balance",
//       "error"
//     );
//   }

//   try {
//     const res = await axiosSecure.post("/rider/cashout", {
//       amount: Number(amount),
//     });

//     Swal.fire(
//       "Success",
//       `You cashed out ৳${res.data.paidAmount}`,
//       "success"
//     );

//     refetch();
//   } catch (err) {
//     Swal.fire(
//       "Error",
//       err.response?.data?.message || "Cash out failed",
//       "error"
//     );
//   }
// };




  if (isLoading) return <p className="text-center mt-10">Loading earnings...</p>;

  const unpaidAmount = data.total;

  return (
    <div className="p-6">
      {/* 🔹 Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">💰 Rider Earnings</h2>

        <button
          disabled={unpaidAmount === 0}
          onClick={handleCashOut}
          className="btn btn-success"
        >
          Cash Out
        </button>
      </div>

      {/* 🔹 Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gray-100 rounded">
          <p className="text-sm text-gray-500">Total Deliveries</p>
          <p className="text-xl font-bold">
            {data.deliveries.length}
          </p>
        </div>

        <div className="p-4 bg-green-100 rounded">
          <p className="text-sm text-gray-600">Total Earned</p>
          <p className="text-xl font-bold text-green-700">
            ৳{data.total}
          </p>
        </div>

        <div className="p-4 bg-red-100 rounded">
          <p className="text-sm text-gray-600">Unpaid Balance</p>
          <p className="text-xl font-bold text-red-700">
            ৳{unpaidAmount}
          </p>
        </div>
      </div>

      {/* 🔹 Earnings Table */}
      {data.deliveries.length === 0 ? (
        <p className="text-center text-gray-500">
          No completed deliveries yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b text-left">#</th>
                <th className="p-3 border-b text-left">Tracking ID</th>
                <th className="p-3 border-b text-left">Rule</th>
                <th className="p-3 border-b text-left">Amount</th>
                <th className="p-3 border-b text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {data.deliveries.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{index + 1}</td>

                  <td className="p-3 border-b">
                    {item.tracking_id}
                  </td>

                  <td className="p-3 border-b capitalize">
                    {item.rule.replace("_", " ")}
                  </td>

                  <td className="p-3 border-b font-medium">
                    ৳{item.amount}
                  </td>

                  <td className="p-3 border-b">
                    <span className="px-2 py-1 rounded text-sm bg-yellow-100 text-yellow-700">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RiderEarnings;
