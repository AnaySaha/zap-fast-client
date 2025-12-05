import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: role = null,
    isLoading: roleLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !!user?.email && !authLoading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/role/${user.email}`);
      return res.data.role;
    },
    staleTime: 5 * 60 * 1000, // cache 5 minutes
  });

  return {
    role,
    loading: authLoading || roleLoading,
    isAdmin: role === "admin",
    isRider: role === "rider",
    isUser: role === "user",
    refetchRole: refetch,
  };
};

export default useUserRole;
