import { useQuery, useQueryClient } from "@tanstack/react-query"; // ✅ import useQueryClient
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaEye, FaTrashAlt, FaMoneyBillWave } from "react-icons/fa";
import Swal from "sweetalert2";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient(); // ✅ get queryClient instance

  const {
    data: parcels = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["my-parcels", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });

  const handleView = (parcel) => {
    alert(`Viewing parcel: ${parcel.title}\nTracking ID: ${parcel.tracking_id}`);
  };

  const handlePay = async (parcel) => {
    alert(`Redirecting to payment for parcel: ${parcel.tracking_id}`);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This parcel will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/parcels/${id}`);
        // ✅ Check deletedCount
        if (res.data.deletedCount > 0 || res.data.success) {
          Swal.fire({
            title: "Deleted!",
            text: "Parcel has been deleted successfully.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });

          // ✅ Refresh data using the correct queryClient instance
          queryClient.invalidateQueries(["my-parcels", user.email]);
        } else {
          Swal.fire({
            title: "Error!",
            text: "Parcel was not found.",
            icon: "error",
          });
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete parcel. Try again.",
          icon: "error",
        });
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
        My Parcels ({parcels.length})
      </h2>

      {parcels.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          No parcels found for your account.
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
                    {parcel.payment_status === "unpaid" && (
                      <button
                        onClick={() => handlePay(parcel)}
                        className="text-green-600 hover:text-green-800"
                        title="Pay"
                      >
                        <FaMoneyBillWave />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(parcel._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FaTrashAlt />
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

export default MyParcels;
