export default function ServiceCard({ service }) {
  const { icon: Icon, title, description } = service;

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-xl transition rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4 text-primary">
        <Icon className="text-3xl" />
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

