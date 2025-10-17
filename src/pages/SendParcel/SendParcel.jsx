


import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SendParcel = () => {
  const {
    register,
    handleSubmit,
    watch,
    
    formState: { errors },
  } = useForm();

  const [selectedSenderRegion, setSelectedSenderRegion] = useState("");
  const [selectedReceiverRegion, setSelectedReceiverRegion] = useState("");

  const parcelType = watch("parcelType");

  const regions = ["Dhaka", "Chattogram", "Khulna"];
  const serviceCenters = {
    Dhaka: ["Uttara", "Dhanmondi", "Mirpur"],
    Chattogram: ["Agrabad", "Pahartali"],
    Khulna: ["Sonadanga", "Khalishpur"],
  };

  const onSubmit = (data) => {
    console.log("Form Data:", data);

    toast.info("Calculating delivery cost...", {
      position: "top-center",
      autoClose: 1500,
    });

    // In next step we’ll calculate cost & show confirmation
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-10">
      <h2 className="text-3xl font-bold text-center mb-2">📦 Send a Parcel</h2>
      <p className="text-center text-gray-500 mb-8">
        Fill in the parcel, sender, and receiver information carefully.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* ---------------- Parcel Info ---------------- */}
        <div>
          <h3 className="text-xl font-semibold border-b pb-2 mb-4">
            Parcel Info
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Parcel Type *</span>
              </label>
              <select
                {...register("parcelType", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select type</option>
                <option value="document">Document</option>
                <option value="non-document">Non-document</option>
              </select>
              {errors.parcelType && (
                <span className="text-red-500 text-sm">Required</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Title *</span>
              </label>
              <input
                type="text"
                {...register("title", { required: true })}
                placeholder="Parcel title"
                className="input input-bordered w-full"
              />
              {errors.title && (
                <span className="text-red-500 text-sm">Required</span>
              )}
            </div>

            {parcelType === "non-document" && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Weight (kg)</span>
                </label>
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

        {/* ---------------- Sender Info ---------------- */}
        <div>
          <h3 className="text-xl font-semibold border-b pb-2 mb-4">
            Sender Info
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              defaultValue={user?.name || ""}
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
                <option key={r}>{r}</option>
              ))}
            </select>

            <select
              {...register("senderServiceCenter", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">Select Service Center</option>
              {selectedSenderRegion &&
                serviceCenters[selectedSenderRegion]?.map((c) => (
                  <option key={c}>{c}</option>
                ))}
            </select>

            <input
              type="text"
              {...register("senderAddress", { required: true })}
              placeholder="Sender Address"
              className="input input-bordered w-full"
            />

            <input
              type="text"
              {...register("pickupInstruction", { required: true })}
              placeholder="Pickup Instruction"
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* ---------------- Receiver Info ---------------- */}
        <div>
          <h3 className="text-xl font-semibold border-b pb-2 mb-4">
            Receiver Info
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
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
                <option key={r}>{r}</option>
              ))}
            </select>

            <select
              {...register("receiverServiceCenter", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">Select Service Center</option>
              {selectedReceiverRegion &&
                serviceCenters[selectedReceiverRegion]?.map((c) => (
                  <option key={c}>{c}</option>
                ))}
            </select>

            <input
              type="text"
              {...register("receiverAddress", { required: true })}
              placeholder="Receiver Address"
              className="input input-bordered w-full"
            />

            <input
              type="text"
              {...register("deliveryInstruction", { required: true })}
              placeholder="Delivery Instruction"
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center pt-4">
          <button type="submit" className="btn btn-primary px-8">
            Submit
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};





export default SendParcel;