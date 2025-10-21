import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: parcels = [],   // ✅ Default empty array
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["my-parcels", user?.email],
    enabled: !!user?.email, // ✅ only run when email is ready
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });

  if (isLoading) return <p>Loading parcels...</p>;
  if (isError) return <p className="text-red-600">Error: {error.message}</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        My Parcels coming here: {parcels?.length ?? 0}
      </h2>
    </div>
  );
};

export default MyParcels;
