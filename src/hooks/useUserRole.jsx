import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: role = "user",
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !authLoading && !!user?.email,  // Wait until user loads
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/role/${user.email}`);
      return res.data.role;
    },
  });

  return {
    role,
    loading: isLoading || authLoading,
    isAdmin: role === "admin",
    isRider: role === "rider",
    isUser: role === "user",
    refetchRole: refetch,
  };
};

export default useUserRole;
