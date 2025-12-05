import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaMotorcycle, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";

const AssignRider = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    data: parcels = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["assign-rider-parcels", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels`);
      // filter only paid and not collected parcels
      return res.data.filter(
        (parcel) =>
          parcel.payment_status === "paid" &&
          parcel.delivery_status === "not_collected"
      );
    },
  });

  const handleView = (parcel) => {
    alert(`Viewing parcel: ${parcel.title}\nTracking ID: ${parcel.tracking_id}`);
  };

  const handleAssignRider = async (parcelId) => {
    const { value: riderName } = await Swal.fire({
      title: "Assign Rider",
      input: "text",
      inputLabel: "Rider Name",
      inputPlaceholder: "Enter rider name",
      showCancelButton: true,
    });

    if (riderName) {
      try {
        const res = await axiosSecure.patch(`/parcels/${parcelId}/assign-rider`, {
          riderName,
        });

        if (res.data.success) {
          Swal.fire({
            title: "Assigned!",
            text: `Rider "${riderName}" has been assigned.`,
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          queryClient.invalidateQueries(["assign-rider-parcels", user.email]);
        } else {
          Swal.fire("Error", "Failed to assign rider.", "error");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Something went wrong!", "error");
      }
    }
  };

  if (isLoading)
    return <p className="text-center mt-10 text-lg">Loading parcels...</p>;

  if (isError)
    return (
      <p className="text-center text-red-600 mt-10">
        Error fetching parcels: {error.message}
      </p>
    );

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        Assign Riders ({parcels.length})
      </h2>

      {parcels.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          No paid parcels pending collection.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left border-b">#</th>
                <th className="p-3 text-left border-b">Type</th>
                <th className="p-3 text-left border-b">Title</th>
                <th className="p-3 text-left border-b">Receiver</th>
                <th className="p-3 text-left border-b">Cost</th>
                <th className="p-3 text-left border-b">Payment</th>
                <th className="p-3 text-left border-b">Delivery</th>
                <th className="p-3 text-left border-b">Created At</th>
                <th className="p-3 text-center border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel, index) => (
                <tr key={parcel._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{index + 1}</td>
                  <td className="p-3 border-b capitalize">{parcel.parcelType}</td>
                  <td className="p-3 border-b">{parcel.title}</td>
                  <td className="p-3 border-b">{parcel.receiverName}</td>
                  <td className="p-3 border-b font-medium text-gray-800">৳{parcel.cost}</td>
                  <td className="p-3 border-b">
                    <span
                      className={`px-2 py-1 text-sm rounded ${
                        parcel.payment_status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {parcel.payment_status}
                    </span>
                  </td>
                  <td className="p-3 border-b capitalize">
                    {parcel.delivery_status.replaceAll("_", " ")}
                  </td>
                  <td className="p-3 border-b">{new Date(parcel.creation_date).toLocaleString()}</td>
                  <td className="p-3 border-b text-center space-x-2">
                    <button
                      onClick={() => handleView(parcel)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleAssignRider(parcel._id)}
                      className="text-purple-600 hover:text-purple-800"
                      title="Assign Rider"
                    >
                      <FaMotorcycle />
                    </button>
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

export default AssignRider;
