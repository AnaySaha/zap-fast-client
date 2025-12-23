import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const PendingDeliveries = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: parcels = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["rider-tasks", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/rider/tasks?email=${user.email}`
      );
      return res.data;
    },
  });

  // 🔄 Update delivery status
  const updateStatus = async (parcelId, status) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `Change status to "${status.replace("_", " ")}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(
        `/parcels/${parcelId}/delivery-status`,
        { status }
      );

      if (res.data.success) {
        Swal.fire("Success", "Status updated successfully", "success");
        refetch();
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  if (isLoading) {
    return <p className="text-center mt-10">Loading deliveries...</p>;
  }

  if (isError) {
    return (
      <p className="text-center text-red-600 mt-10">
        Error: {error.message}
      </p>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        Pending Deliveries ({parcels.length})
      </h2>

      {parcels.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          No pending deliveries assigned to you.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b">#</th>
                <th className="p-3 border-b">Tracking ID</th>
                <th className="p-3 border-b">Receiver</th>
                <th className="p-3 border-b">Address</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {parcels.map((parcel, index) => (
                <tr key={parcel._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{index + 1}</td>
                  <td className="p-3 border-b font-mono">
                    {parcel.tracking_id}
                  </td>
                  <td className="p-3 border-b">
                    {parcel.receiverName}
                  </td>
                  <td className="p-3 border-b">
                    {parcel.receiverAddress}
                  </td>
                  <td className="p-3 border-b capitalize">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        parcel.delivery_status === "rider_assigned"
                          ? "bg-yellow-100 text-yellow-700"
                          : parcel.delivery_status === "in_transit"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {parcel.delivery_status.replace("_", " ")}
                    </span>
                  </td>

                  <td className="p-3 border-b text-center space-x-2">
                    {parcel.delivery_status === "rider_assigned" && (
                      <button
                        onClick={() =>
                          updateStatus(parcel._id, "in_transit")
                        }
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Mark Picked Up
                      </button>
                    )}

                    {parcel.delivery_status === "in_transit" && (
                      <button
                        onClick={() =>
                          updateStatus(parcel._id, "delivered")
                        }
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Mark Delivered
                      </button>
                    )}

                    {parcel.delivery_status === "delivered" && (
                      <span className="text-green-600 font-medium">
                       Delivary Completed 
                      </span>
                    )}
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

export default PendingDeliveries;
