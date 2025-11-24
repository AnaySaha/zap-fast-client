import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";


const BeARider = () => {
  const { user } = useAuth();

  const [serviceCenters, setServiceCenters] = useState([]);
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const axiosSecure = useAxiosSecure();

  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    age: "",
    region: "",
    district: "",
    phone: "",
    nid: "",
    bikeBrand: "",
    bikeReg: "",
    status: "pending", // default status
  });

  // Load service center data
  useEffect(() => {
    fetch("/servicecenter.json")
      .then((res) => res.json())
      .then((data) => {
        setServiceCenters(data);
        setRegions([...new Set(data.map((item) => item.region))]); // unique regions
      });
  }, []);

  // When region changes, update districts
  useEffect(() => {
    if (formData.region) {
      const filtered = serviceCenters
        .filter((item) => item.region === formData.region)
        .map((item) => item.district);

      setDistricts([...new Set(filtered)]);
    }
  }, [formData.region, serviceCenters]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Rider Application Submitted:", formData);

    // TODO: POST to backend
    axiosSecure.post('/riders', formData)
      .then(res => {
      if(res.data.insertedId)
        Swal.fire({
      icon: "success",
      title: "Application Submitted!!",
      text: "Your application is pending approval."
    })
      })
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Become a Rider</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name */}
        <div>
          <label className="block font-semibold mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        {/* Age */}
        <div>
          <label className="block font-semibold mb-1">Age</label>
          <input
            type="number"
            name="age"
            placeholder="Enter your age"
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Region */}
        <div>
          <label className="block font-semibold mb-1">Region</label>
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Region</option>
            {regions.map((region, idx) => (
              <option key={idx} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label className="block font-semibold mb-1">District</label>
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
            disabled={!formData.region}
          >
            <option value="">Select District</option>
            {districts.map((district, idx) => (
              <option key={idx} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        {/* Phone */}
        <div>
          <label className="block font-semibold mb-1">Phone Number</label>
          <input
            type="text"
            name="phone"
            placeholder="Enter phone number"
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* NID */}
        <div>
          <label className="block font-semibold mb-1">National ID Number</label>
          <input
            type="text"
            name="nid"
            placeholder="Enter NID number"
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Bike Brand */}
        <div>
          <label className="block font-semibold mb-1">Bike Brand</label>
          <input
            type="text"
            name="bikeBrand"
            placeholder="Ex: Honda, Yamaha"
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Bike Registration Number */}
        <div>
          <label className="block font-semibold mb-1">Bike Registration Number</label>
          <input
            type="text"
            name="bikeReg"
            placeholder="Enter registration number"
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Submit */}
        <button className="btn btn-primary w-full mt-4">
          Submit Rider Application
        </button>
      </form>
    </div>
  );
};

export default BeARider;
