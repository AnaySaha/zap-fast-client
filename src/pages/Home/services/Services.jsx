import { FaTruck, FaGlobe, FaWarehouse, FaMoneyBillWave, FaBuilding, FaUndo } from "react-icons/fa";
import ServiceCard from "../services/ServiceCard";

const services = [
  {
    title: "Express & Standard Delivery",
    description:
      "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4–6 hours from pick-up to drop-off.",
    icon: FaTruck,
  },
  {
    title: "Nationwide Delivery",
    description:
      "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48–72 hours.",
    icon: FaGlobe,
  },
  {
    title: "Fulfillment Solution",
    description:
      "We also offer customized service with inventory management support, online order processing, packaging, and after sales support.",
    icon: FaWarehouse,
  },
  {
    title: "Cash on Home Delivery",
    description:
      "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.",
    icon: FaMoneyBillWave,
  },
  {
    title: "Corporate Service / Contract In Logistics",
    description:
      "Customized corporate services which includes warehouse and inventory management support.",
    icon: FaBuilding,
  },
  {
    title: "Parcel Return",
    description:
      "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.",
    icon: FaUndo,
  },
];

export default function Services() {
  return (
    <section className="py-16 bg-base-200">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl text-primary md:text-4xl font-bold text-primary">Our Services</h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Enjoy fast reliable parcel delivery with real-time tracking and zero hassle. 
         Enjoy
        </p>

        {/* Responsive grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
            service={service}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
