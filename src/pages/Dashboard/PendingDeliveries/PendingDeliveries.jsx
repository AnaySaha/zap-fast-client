import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const PendingDeliveries = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: parcels = [], isLoading, isError, error } = useQuery({
    queryKey: ["pending-deliveries", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/rider/tasks?email=${user.email}`);
      return res.data;
    },
  });

  const updateStatus = async (parcel, newStatus) => {
    const actionText =
      newStatus === "in_transit"
        ? "mark this parcel as Picked Up?"
        : "mark this parcel as Delivered?";

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to ${actionText}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, confirm",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosSecure.patch(`/parcels/${parcel._id}/status`, {
        delivery_status: newStatus,
      });

      Swal.fire({
        icon: "success",
        title: "Updated!",
        timer: 1200,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries(["pending-deliveries", user.email]);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update parcel status", "error");
    }
  };

  if (isLoading) return <p>Loading pending deliveries...</p>;
  if (isError) return <p className="text-red-600">{error.message}</p>;

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
          <table className="table w-full">
            <thead className="bg-gray-100">
              <tr>
                <th>#</th>
                <th>Tracking ID</th>
                <th>Receiver</th>
                <th>Address</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {parcels.map((parcel, index) => (
                <tr key={parcel._id}>
                  <td>{index + 1}</td>
                  <td className="font-mono text-sm">{parcel.tracking_id}</td>
                  <td>{parcel.receiverName}</td>
                  <td className="max-w-xs truncate">{parcel.receiverAddress}</td>
                  <td>
                    <span
                      className={`px-2 py-1 text-sm rounded ${
                        parcel.delivery_status === "assigned"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {parcel.delivery_status.replace("_", " ")}
                    </span>
                  </td>

                  <td>
                    {parcel.delivery_status === "assigned" && (
                      <button
                        onClick={() => updateStatus(parcel, "in_transit")}
                        className="btn btn-sm bg-blue-500 text-white"
                      >
                        Picked Up
                      </button>
                    )}

                    {parcel.delivery_status === "in_transit" && (
                      <button
                        onClick={() => updateStatus(parcel, "delivered")}
                        className="btn btn-sm bg-green-500 text-white"
                      >
                        Delivered
                      </button>
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
