import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";
import Swal from "sweetalert2";

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedRider, setSelectedRider] = useState(null);

  // Load pending riders
  const {isLoading, data: riders = [],} = useQuery({
    queryKey: ["pending-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/pending");
      return res.data.data;
    },
  });

  if (isLoading) return <p className="p-6">Loading...</p>;

  // Approve rider
  const handleApprove = async (id) => {
    try {
      await axiosSecure.patch(`/riders/approve/${id}`);

      Swal.fire({
        icon: "success",
        title: "Rider Approved!",
        timer: 1500,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries(["pending-riders"]);
      setSelectedRider(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Reject rider
  const handleReject = async (id) => {
    try {
      await axiosSecure.patch(`/riders/reject/${id}`);

      Swal.fire({
        icon: "error",
        title: "Rider Rejected!",
        timer: 1500,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries(["pending-riders"]);
      setSelectedRider(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Riders</h2>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
        <table className="table">
          <thead>
            <tr className="bg-gray-100">
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Region</th>
              <th>District</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {riders.map((rider, idx) => (
              <tr key={rider._id}>
                <td>{idx + 1}</td>
                <td>{rider.name}</td>
                <td>{rider.email}</td>
                <td>{rider.phone}</td>
                <td>{rider.region}</td>
                <td>{rider.district}</td>

                <td>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => setSelectedRider(rider)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {riders.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No pending rider applications
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedRider && (
        <dialog id="riderModal" open className="modal">
          <div className="modal-box max-w-lg">
            <h3 className="font-bold text-xl mb-4">
              Rider Application Details
            </h3>

            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedRider.name}</p>
              <p><strong>Email:</strong> {selectedRider.email}</p>
              <p><strong>Phone:</strong> {selectedRider.phone}</p>
              <p><strong>Region:</strong> {selectedRider.region}</p>
              <p><strong>District:</strong> {selectedRider.district}</p>
              <p><strong>Age:</strong> {selectedRider.age}</p>
              <p><strong>NID:</strong> {selectedRider.nidNumber}</p>
              <p><strong>Bike Brand:</strong> {selectedRider.bikeBrand}</p>
              <p><strong>Bike Reg:</strong> {selectedRider.bikeReg}</p>
              <p><strong>Status:</strong> {selectedRider.status}</p>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-success"
                onClick={() => handleApprove(selectedRider._id)}
              >
                Approve
              </button>

              <button
                className="btn btn-error"
                onClick={() => handleReject(selectedRider._id)}
              >
                Reject
              </button>

              <button
                className="btn"
                onClick={() => setSelectedRider(null)}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default PendingRiders;
