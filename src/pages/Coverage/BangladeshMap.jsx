

  
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';

const BangladeshMap = ({serviceCenters}) => {
  // Define marker icon fix (Leaflet default marker path issue in React)
  const defaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
  L.Marker.prototype.options.icon = defaultIcon;

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center py-10">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-6">
        We are available in 64 districts
      </h1>

      {/* Map Container */}
      <div className="w-full max-w-5xl h-[500px] rounded-2xl overflow-hidden shadow-lg">
        <MapContainer
          center={[23.685, 90.3563]} // Coordinates of Bangladesh
          zoom={7}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          {/* Map Tiles from OpenStreetMap */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

        {
            serviceCenters.map((center, index) =>
            <Marker 
            key={index}
          position={[center.latitude, center.longitude]}>
            
            <Popup>
                <strong>{center.district}</strong><br />
                {center.covered_area.join(',')}
                We are available across Bangladesh!
            </Popup>
          </Marker>
            )
       
        }
   
        </MapContainer>
      </div>
    </div>
  );
};

export default BangladeshMap;
