import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../hooks/useAuth";


// src/utils/generateTrackingId.js

 const generateTrackingId = () => {
  // Example output: TRK-20251020-72643YQJ
  const now = new Date();

  // Date part (YYYYMMDD)
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");

  // Time part (last 5 digits of timestamp to ensure uniqueness)
  const timePart = now.getTime().toString().slice(-5);

  // Random uppercase letters/numbers (for extra uniqueness)
  const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();

  // Final ID format
  return `TRK-${datePart}-${timePart}${randomPart}`;
};


const SendParcel = () => {
  
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const {user} = useAuth();
  

  const [serviceData, setServiceData] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedSenderRegion, setSelectedSenderRegion] = useState("");
  const [selectedReceiverRegion, setSelectedReceiverRegion] = useState("");

  const parcelType = watch("parcelType");

  useEffect(() => {
    // Load service center (warehouse) data
    fetch("/servicecenter.json")
      .then((res) => res.json())
      .then((data) => {
        setServiceData(data);
        // Extract unique region names
        const uniqueRegions = [...new Set(data.map((item) => item.region))];
        setRegions(uniqueRegions);
      })
      .catch((err) => console.error("Failed to load service center data:", err));
  }, []);

  const getServiceCentersByRegion = (region) => {
    return serviceData.filter((item) => item.region === region);
  };

const onSubmit = (data) => {
  const isWithinDistrict = data.senderServiceCenter === data.receiverServiceCenter;
  const weight = Number(data.weight) || 0;
  let baseCost = 0;
  let breakdown = "";

  if (data.parcelType === "document") {
    baseCost = isWithinDistrict ? 60 : 80;
    breakdown = `
      <tr>
        <td>Parcel Type:</td><td><b>Document</b></td>
      </tr>
      <tr>
        <td>Delivery Type:</td><td>${isWithinDistrict ? "Within District" : "Outside District"}</td>
      </tr>
      <tr>
        <td>Base Charge:</td><td>৳${baseCost}</td>
      </tr>
    `;
  } else if (data.parcelType === "non-document") {
    if (weight <= 3) {
      baseCost = isWithinDistrict ? 110 : 150;
      breakdown = `
        <tr><td>Parcel Type:</td><td><b>Non-Document</b></td></tr>
        <tr><td>Weight:</td><td>${weight} kg</td></tr>
        <tr><td>Base Charge (up to 3kg):</td><td>৳${isWithinDistrict ? 110 : 150}</td></tr>
        <tr><td>Delivery Type:</td><td>${isWithinDistrict ? "Within District" : "Outside District"}</td></tr>
      `;
    } else {
      const extraKg = weight - 3;
      const extraCost = extraKg * 40;
      baseCost = isWithinDistrict ? 110 + extraCost : 150 + extraCost + 40;
      breakdown = `
        <tr><td>Parcel Type:</td><td><b>Non-Document</b></td></tr>
        <tr><td>Weight:</td><td>${weight} kg</td></tr>
        <tr><td>Base Charge (first 3kg):</td><td>৳${isWithinDistrict ? 110 : 150}</td></tr>
        <tr><td>Extra Weight (${extraKg}kg × ৳40):</td><td>৳${extraCost}</td></tr>
        ${
          !isWithinDistrict
            ? `<tr><td>Outside District Surcharge:</td><td>৳40</td></tr>`
            : ""
        }
      `;
    }
  }

  Swal.fire({
    title: "<h2 style='color:#333;font-weight:600;'>Delivery Cost Breakdown</h2>",
    html: `
      <div style="text-align:left;font-size:15px;">
        <table style="width:100%;margin:auto;border-collapse:collapse;">
          ${breakdown}
        </table>
        <hr style="margin:10px 0;">
        <h3 style="text-align:center;color:#16a34a;">Total: <b>৳${baseCost}</b></h3>
      </div>
    `,
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "Proceed to Payment",
    cancelButtonText: "Edit Information",
    confirmButtonColor: "#16a34a",
    cancelButtonColor: "#d33",
    allowOutsideClick: false,
    width: "400px",
    backdrop: true,
    customClass: {
      popup: "rounded-2xl shadow-xl p-4",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      // User chose to proceed
      handleConfirm(data, baseCost);
      Swal.fire({
        title: "Redirecting...",
        text: "Proceeding to payment page...",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    } else {
      // User wants to edit info — no action, just close
      Swal.fire({
        title: "Edit Your Details",
        text: "You can now update your parcel info before confirming.",
        icon: "info",
        timer: 1200,
        showConfirmButton: false,
      });
    }
  });
};

  const handleConfirm = (data, cost) => {
    const parcelData = {
      ...data,
      cost,
      created_by: user.email,
      payment_status: 'unpaid',
      delivery_status: 'not_collected',
      tracking_id: generateTrackingId(),
      creation_date: new Date().toISOString(),
    };
    console.log("Saving to DB:", parcelData);

    reset();
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-10">
      <h2 className="text-3xl font-bold text-center mb-2">📦 Send a Parcel</h2>
      <p className="text-center text-gray-500 mb-8">
        Fill in the parcel, sender, and receiver information.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* =============== Parcel Info =============== */}
        <div>
          <h3 className="text-xl font-semibold border-b pb-2 mb-4">
            Parcel Info
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Type */}
            <div className="form-control">
              <label className="label font-medium">Parcel Type *</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="document"
                    {...register("parcelType", { required: true })}
                    className="radio radio-primary"
                  />
                  Document
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="non-document"
                    {...register("parcelType", { required: true })}
                    className="radio radio-primary"
                  />
                  Non-document
                </label>
              </div>
              {errors.parcelType && (
                <span className="text-red-500 text-sm">Required</span>
              )}
            </div>

            {/* Title */}
            <div className="form-control">
              <label className="label font-medium">Parcel Name</label>
              <input
                type="text"
                {...register("title", { required: true })}
                placeholder="Describe your parcel"
                className="input input-bordered w-full"
              />
              {errors.title && (
                <span className="text-red-500 text-sm">Required</span>
              )}
            </div>

            {/* Weight (conditional) */}
            {parcelType === "non-document" && (
              <div className="form-control">
                <label className="label font-medium">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register("weight")}
                  placeholder="e.g., 2.5"
                  className="input input-bordered w-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* =============== Sender & Receiver Info Side by Side =============== */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Sender Info */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold border-b pb-2 mb-4">
              Sender Info
            </h3>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                defaultValue="John Doe"
                {...register("senderName", { required: true })}
                placeholder="Sender Name"
                className="input input-bordered w-full"
              />
              <input
                type="text"
                {...register("senderContact", { required: true })}
                placeholder="Sender Contact"
                className="input input-bordered w-full"
              />
              <select
                {...register("senderRegion", { required: true })}
                onChange={(e) => setSelectedSenderRegion(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="">Select Region</option>
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <select
                {...register("senderServiceCenter", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Service Center</option>
                {selectedSenderRegion &&
                  getServiceCentersByRegion(selectedSenderRegion).map((sc) => (
                    <option key={sc.district} value={sc.district}>
                      {sc.district}
                    </option>
                  ))}
              </select>
              <input
                type="text"
                {...register("senderAddress", { required: true })}
                placeholder="Sender Address"
                className="input input-bordered w-full"
              />
              <textarea
                {...register("pickupInstruction", { required: true })}
                placeholder="Pickup Instruction"
                className="textarea textarea-bordered w-full"
              />
            </div>
          </div>

          {/* Receiver Info */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold border-b pb-2 mb-4">
              Receiver Info
            </h3>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                {...register("receiverName", { required: true })}
                placeholder="Receiver Name"
                className="input input-bordered w-full"
              />
              <input
                type="text"
                {...register("receiverContact", { required: true })}
                placeholder="Receiver Contact"
                className="input input-bordered w-full"
              />
              <select
                {...register("receiverRegion", { required: true })}
                onChange={(e) => setSelectedReceiverRegion(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="">Select Region</option>
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <select
                {...register("receiverServiceCenter", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Service Center</option>
                {selectedReceiverRegion &&
                  getServiceCentersByRegion(selectedReceiverRegion).map((sc) => (
                    <option key={sc.district} value={sc.district}>
                      {sc.district}
                    </option>
                  ))}
              </select>
              <input
                type="text"
                {...register("receiverAddress", { required: true })}
                placeholder="Receiver Address"
                className="input input-bordered w-full"
              />
              <textarea
                {...register("deliveryInstruction", { required: true })}
                placeholder="Delivery Instruction"
                className="textarea textarea-bordered w-full"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center pt-4">
          <button type="submit" className="btn btn-primary px-8">
            Submit
          </button>
        </div>
      </form>

    
    </div>
  );
};

export default SendParcel;
