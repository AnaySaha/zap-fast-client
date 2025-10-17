import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SendParcel = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

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
    let baseCost = data.parcelType === "document" ? 50 : 100;
    if (data.parcelType === "non-document" && data.weight) {
      baseCost += Number(data.weight) * 10;
    }

    toast.info(
      <div className="text-center">
        <p className="font-semibold">Delivery Cost: ৳{baseCost}</p>
        <button
          className="btn btn-success btn-sm mt-2"
          onClick={() => handleConfirm(data, baseCost)}
        >
          Confirm
        </button>
      </div>,
      { autoClose: false }
    );
  };

  const handleConfirm = (data, cost) => {
    const parcelData = {
      ...data,
      cost,
      creation_date: new Date().toISOString(),
    };
    console.log("Saving to DB:", parcelData);
    toast.dismiss();
    toast.success("✅ Parcel successfully created!");
    reset();
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-10">
      <h2 className="text-3xl font-bold text-center mb-2">📦 Send a Parcel</h2>
      <p className="text-center text-gray-500 mb-8">
        Fill in the parcel, sender, and receiver information carefully.
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
              <label className="label font-medium">Title *</label>
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

      <ToastContainer />
    </div>
  );
};

export default SendParcel;
