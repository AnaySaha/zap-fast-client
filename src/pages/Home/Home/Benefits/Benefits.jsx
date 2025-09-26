import benefit1 from "/src/assets/tiny.png";
import benefit2 from "/src/assets/safe.png";
import benefit3 from "/src/assets/safe.png";

const benefits = [
  {
    image: benefit1,
    title: "Fast & Reliable",
    description:
      "Deliveries are always on time with real-time tracking for peace of mind.",
  },
  {
    image: benefit2,
    title: "Secure Handling",
    description:
      "Your parcels are handled with care and delivered safely, every time.",
  },
  {
    image: benefit3,
    title: "Customer Satisfaction",
    description:
      "We prioritize customer happiness with dedicated support and seamless service.",
  },
];

export default function Benefits() {
  return (
    <div className="hero bg-base-100 py-16">
      <div className="hero-content max-w-3xl w-full flex-col">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">
          Why Choose Us
        </h2>

        <div className="mt-10 flex flex-col gap-6 w-full">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="card bg-base-200 shadow-md hover:shadow-xl transition rounded-xl p-6 flex flex-row items-center gap-6 text-left"
            >
              {/* Left Image */}
              <img
                src={benefit.image}
                alt={benefit.title}
                className="h-20 w-20 object-contain flex-shrink-0"
              />

              {/* Right Content */}
              <div>
                <h3 className="text-xl font-semibold">{benefit.title}</h3>
                <p className="mt-2 text-gray-600 text-sm">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

