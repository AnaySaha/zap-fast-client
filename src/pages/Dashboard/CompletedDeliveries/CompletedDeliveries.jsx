import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const CompletedDeliveries = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: parcels = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["completed-deliveries", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/rider/completed?email=${user.email}`
      );
      return res.data;
    },
  });

  if (isLoading) {
    return <p className="text-center mt-10">Loading delivery history...</p>;
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
        Completed Deliveries ({parcels.length})
      </h2>

      {parcels.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          You have no completed deliveries yet.
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
                <th className="p-3 border-b">Delivered At</th>
                <th className="p-3 border-b">Status</th>
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
                  <td className="p-3 border-b">
                    {parcel.updatedAt
                      ? new Date(parcel.updatedAt).toLocaleString()
                      : "—"}
                  </td>
                  <td className="p-3 border-b">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                      Delivered
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

export default CompletedDeliveries;
