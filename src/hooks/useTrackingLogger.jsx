import useAxiosSecure from "./useAxiosSecure";

const useTrackingLogger = () => {
  const axiosSecure = useAxiosSecure();

  const logTrackingUpdate = async ({
    tracking_id,
    status,
    details = "",
    location = "",
    updated_by = "",
    rider = null, // ✅ ADD THIS
  }) => {
    try {
      const payload = {
        tracking_id,
        status,
        details,
        location,
        updated_by,
        rider, // ✅ SEND TO BACKEND
      };

      await axiosSecure.post("/trackings", payload);
    } catch (error) {
      console.error("Failed to log tracking:", error);
    }
  };

  return { logTrackingUpdate };
};

export default useTrackingLogger;
