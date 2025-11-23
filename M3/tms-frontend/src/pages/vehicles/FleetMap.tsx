import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const createIcon = (icon: string) => new DivIcon({
  className: 'my-div-icon',
  html: `<span class="text-2xl">${icon}</span>`
})

const truckIcon = createIcon('🚚')
const pinIcon = createIcon('📍')

const airportIcon = new DivIcon({
  className: 'my-div-icon',
  html: '<img class="my-div-image" src="http://png-3.vector.me/files/images/4/0/402272/aiga_air_transportation_bg_thumb"/>'+
        '<span class="my-div-span">RAF Banff Airfield</span>'
})

type Coordinates = [number, number];
type Description = {
  title: string;
  content: JSX.Element;
}

type FleetMapProps = {
  items: {
    coordinates: Coordinates;
    description: Description;
  }[]
}

// more fun here: https://rubenspgcavalcante.github.io/leaflet-ant-path/
export const FleetMap: React.FC<FleetMapProps> = ({ items }) => {
  return (
    <MapContainer center={items[0].coordinates} zoom={4} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {items.map((item, index) => (
        <Marker key={index} position={item.coordinates} icon={truckIcon}>
          <Popup>
            <div className="text-center">
              <h4 className="font-semibold text-gray-900">{item.description.title}</h4>
              <p className="text-gray-600 mt-1">{item.description.content}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
