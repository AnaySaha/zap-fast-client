import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaMotorcycle, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";

const AssignRider = () => {
  const { user } = useAuth();
  console.log(user)
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  /* ================= PARCELS ================= */
  const {
    data: parcels = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["assign-rider-parcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels");
      return res.data.filter(
        (p) =>
          p.payment_status === "paid" &&
          p.delivery_status === "not_collected"
      );
    },
  });

  /* ================= VIEW ================= */
  const handleView = (parcel) => {
    Swal.fire({
      title: "Parcel Details",
      html: `
        <p><b>Tracking:</b> ${parcel.tracking_id}</p>
        <p><b>Receiver:</b> ${parcel.receiverName}</p>
        <p><b>Region:</b> ${parcel.receiverRegion}</p>
        <p><b>Cost:</b> ৳${parcel.cost}</p>
      `,
    });
  };

  /* ================= ASSIGN RIDER ================= */
  const handleAssignRider = async (parcel) => {
    try {
      // 1️⃣ Fetch riders by receiver region
      const ridersRes = await axiosSecure.get(
        `/riders/by-region?region=${parcel.receiverRegion}`
      );

      const riders = ridersRes.data;

      if (!riders.length) {
        return Swal.fire(
          "No Riders Found",
          `No active riders in ${parcel.receiverRegion}`,
          "warning"
        );
      }

      // 2️⃣ Build dropdown options
      const optionsHtml = riders
        .map(
          (r) =>
            `<option value="${r.email}">${r.name} (${r.email})</option>`
        )
        .join("");

      // 3️⃣ SweetAlert dropdown
      const { value: selectedEmail } = await Swal.fire({
        title: "Assign Rider",
        html: `
          <select id="riderSelect" class="swal2-select">
            <option value="">Select a rider</option>
            ${optionsHtml}
          </select>
        `,
        showCancelButton: true,
        preConfirm: () => {
          const email = document.getElementById("riderSelect").value;
          if (!email) {
            Swal.showValidationMessage("Please select a rider");
          }
          return email;
        },
      });

      if (!selectedEmail) return;

      const selectedRider = riders.find(
        (r) => r.email === selectedEmail
      );

      // 4️⃣ Assign rider
      const res = await axiosSecure.patch(
        `/parcels/${parcel._id}/assign-rider`,
        {
          riderName: selectedRider.name,
          riderEmail: selectedRider.email,
        }
      );

      if (res.data.success) {
        Swal.fire("Success", "Rider assigned successfully", "success");
        queryClient.invalidateQueries(["assign-rider-parcels"]);
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to assign rider", "error");
    }
  };

  /* ================= STATES ================= */
  if (isLoading)
    return <p className="text-center mt-10">Loading parcels...</p>;

  if (isError)
    return (
      <p className="text-center text-red-600 mt-10">
        {error.message}
      </p>
    );

  /* ================= UI ================= */
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        Assign Riders ({parcels.length})
      </h2>

      {parcels.length === 0 ? (
        <p className="text-center text-gray-500">
          No paid parcels pending collection.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Title</th>
                <th className="p-3">Receiver</th>
                <th className="p-3">Region</th>
                <th className="p-3">Cost</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel, index) => (
                <tr key={parcel._id} className="hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{parcel.title}</td>
                  <td className="p-3">{parcel.receiverName}</td>
                  <td className="p-3">{parcel.receiverRegion}</td>
                  <td className="p-3 font-semibold">৳{parcel.cost}</td>
                  <td className="p-3 capitalize">
                    {parcel.delivery_status.replaceAll("_", " ")}
                  </td>
                  <td className="p-3 text-center space-x-3">
                    <button
                      onClick={() => handleView(parcel)}
                      className="text-blue-600"
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleAssignRider(parcel)}
                      className="text-purple-600"
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
