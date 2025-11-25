import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");

  // Load active riders
  const { data: riders = [], isLoading } = useQuery({
    queryKey: ["active-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/active");
      return res.data.data;
    },
  });

  if (isLoading) return <p className="p-6">Loading...</p>;

  // Filter by search term
  const filteredRiders = riders.filter((rider) =>
    rider.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Deactivate rider
  const handleDeactivate = async (id) => {
    Swal.fire({
      title: "Deactivate Rider?",
      text: "This rider will no longer be active.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deactivate",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/riders/deactivate/${id}`);

          Swal.fire({
            icon: "success",
            title: "Rider Deactivated!",
            timer: 1500,
            showConfirmButton: false,
          });

          queryClient.invalidateQueries(["active-riders"]);
        } catch (error) {
          console.error(error);
          Swal.fire("Error", "Failed to deactivate rider", "error");
        }
      }
    });
  };

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-4">Active Riders</h2>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="input input-bordered w-full md:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Riders Table */}
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
              <th>Bike</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredRiders.length > 0 ? (
              filteredRiders.map((rider, idx) => (
                <tr key={rider._id}>
                  <td>{idx + 1}</td>
                  <td>{rider.name}</td>
                  <td>{rider.email}</td>
                  <td>{rider.phone}</td>
                  <td>{rider.region}</td>
                  <td>{rider.district}</td>
                  <td>
                    {rider.bikeBrand} ({rider.bikeReg})
                  </td>

                  <td>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => handleDeactivate(rider._id)}
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center text-gray-500 p-4"
                >
                  No active riders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ActiveRiders;
