import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const statusColor = {
  rider_assigned: "bg-yellow-100 text-yellow-700",
  in_transit: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
};

const Trackparcel = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["my-parcels", user?.email],
    enabled: !!user?.email,
    refetchInterval: 5000, // 🔴 LIVE UPDATE
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/my-parcels?email=${user.email}`
      );
      return res.data;
    },
  });

  if (isLoading) {
    return <p className="text-center mt-10">Loading parcels...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        My Parcels ({parcels.length})
      </h2>

      {parcels.length === 0 ? (
        <p className="text-center text-gray-500">
          You haven’t sent any parcels yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Parcel Name</th>
                <th className="p-3 border">Type</th>
                <th className="p-3 border">Tracking ID</th>
                <th className="p-3 border">Receiver</th>
                <th className="p-3 border">Current Status</th>
              </tr>
            </thead>

            <tbody>
              {parcels.map(parcel => (
                <tr key={parcel._id} className="hover:bg-gray-50">
                  <td className="p-3 border">{parcel.title}</td>
                  <td className="p-3 border capitalize">
                    {parcel.parcelType}
                  </td>
                  <td className="p-3 border font-mono">
                    {parcel.tracking_id}
                  </td>
                  <td className="p-3 border">
                    {parcel.receiverName}
                  </td>
                  <td className="p-3 border">
                    <span
                      className={`px-2 py-1 rounded text-sm capitalize ${
                        statusColor[parcel.delivery_status]
                      }`}
                    >
                      {parcel.delivery_status.replace("_", " ")}
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

export default Trackparcel;
