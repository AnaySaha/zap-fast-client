import { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const MakeAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]); // live suggestions
  const [results, setResults] = useState([]);         // search button results

  // Live suggestions on typing
  const handleChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axiosSecure.get(`/users/search?query=${value}`);
      setSuggestions(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Search button → show matched results
const handleSearch = async () => {
  if (!searchTerm.trim()) return;
  try {
    const res = await axiosSecure.get(`/users/search?query=${searchTerm}`);
    setResults(res.data.data);  // set results from fresh API call
    setSuggestions([]);         // hide dropdown
  } catch (err) {
    console.error(err);
  }
};


  const handleMakeAdmin = async (email) => {
    try {
      await axiosSecure.patch(`/users/make-admin/${email}`);
      Swal.fire("Success!", `${email} is now an admin!`, "success");
      setResults(results.map(u => u.email === email ? { ...u, role: "admin" } : u));
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to make admin", "error");
    }
  };

  const handleRemoveAdmin = async (email) => {
    try {
      await axiosSecure.patch(`/users/remove-admin/${email}`);
      Swal.fire("Success!", `${email} is no longer an admin!`, "success");
      setResults(results.map(u => u.email === email ? { ...u, role: "user" } : u));
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to remove admin", "error");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Make Admin</h2>

      {/* Search Input + Button */}
      <div className="flex gap-2 mb-4">
  <input
    type="text"
    placeholder="Search by name or email..."
    value={searchTerm}
    onChange={handleChange}
    className="input input-bordered w-full md:w-1/2"
  />
  <button className="btn btn-primary" onClick={handleSearch}>
    Search
  </button>
</div>


      {/* Live Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div className="border rounded shadow max-w-md mb-4 bg-white">
          {suggestions.map((user) => (
            <div
              key={user._id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSearchTerm(user.name || user.email);
                setSuggestions([]);
                setResults([user]); // select single user
              }}
            >
              <p>{user.name || "-"}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          ))}
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 ? (
        <div className="bg-white shadow rounded p-4 max-w-2xl">
          {results.map((user) => (
            <div
              key={user._id}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <p className="font-semibold">{user.name || "-"}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-400">Role: {user.role}</p>
              </div>

              <div className="flex gap-2">
                {user.role !== "admin" ? (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleMakeAdmin(user.email)}
                  >
                    Make Admin
                  </button>
                ) : (
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => handleRemoveAdmin(user.email)}
                  >
                    Remove Admin
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No users found. Try searching above.</p>
      )}
    </div>
  );
};

export default MakeAdmin;
