import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const MakeAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!q || q.trim().length < 2) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const res = await axiosSecure.get(`/users/search?email=${encodeURIComponent(q)}`);
      setResults(res.data.users || []);
    } catch (err) {
      console.error("Search error:", err);
      Swal.fire("Error", "Search failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const makeAdmin = async (email) => {
    const confirm = await Swal.fire({
      title: `Make ${email} an admin?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, make admin",
    });
    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.patch(`/users/make-admin/${encodeURIComponent(email)}`);
      Swal.fire("Success", "User promoted to admin", "success");
      handleSearch(); // refresh results
      queryClient.invalidateQueries(["active-riders", "pending-riders"]); // optional
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to promote user", "error");
    }
  };

  const removeAdmin = async (email) => {
    const confirm = await Swal.fire({
      title: `Remove admin role from ${email}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
    });
    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.patch(`/users/remove-admin/${encodeURIComponent(email)}`);
      Swal.fire("Success", "Admin removed", "success");
      handleSearch(); // refresh results
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to remove admin", "error");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Admin Management</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by email (partial allowed)"
          className="input input-bordered flex-1"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="space-y-3">
        {results.length === 0 && !loading && (
          <div className="text-sm text-gray-500">No results. Type at least 2 characters and press Search.</div>
        )}

        {results.map((u) => (
          <div key={u.email} className="p-4 border rounded-md flex items-center justify-between">
            <div>
              <div className="font-medium">{u.email}</div>
              <div className="text-sm text-gray-500">Role: <span className="font-semibold">{u.role || "user"}</span></div>
              {u.created_at && (
                <div className="text-xs text-gray-400">Created: {new Date(u.created_at).toLocaleString()}</div>
              )}
            </div>

            <div className="flex gap-2">
              {u.role !== "admin" ? (
                <button className="btn btn-sm btn-success" onClick={() => makeAdmin(u.email)}>
                  Make Admin
                </button>
              ) : (
                <button className="btn btn-sm btn-warning" onClick={() => removeAdmin(u.email)}>
                  Remove Admin
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MakeAdmin;
