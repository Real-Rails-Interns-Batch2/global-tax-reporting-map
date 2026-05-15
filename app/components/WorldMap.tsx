"use client";
import L from "leaflet";
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { flows } from "../data/flows";

type Props = {
  onSelectCountry: (countryName: string) => void;
};

const locations = [
  {
    name: "India",
    position: [20.5937, 78.9629],
  },
  {
    name: "Singapore",
    position: [1.3521, 103.8198],
  },
  {
    name: "United Kingdom",
    position: [55.3781, -3.436],
  },
  {
    name: "United Arab Emirates",
    position: [23.4241, 53.8478],
  },
];

const countryCoordinates: Record<string, [number, number]> = {
  India: [20.5937, 78.9629],
  Singapore: [1.3521, 103.8198],
  "United Kingdom": [55.3781, -3.436],
  "United Arab Emirates": [23.4241, 53.8478],
};

export default function WorldMap({
  onSelectCountry,
}: Props) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      scrollWheelZoom={true}
      className="h-full w-full rounded-2xl"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {locations.map((country) => (
        <Marker
          key={country.name}
          position={country.position as [number, number]}
          eventHandlers={{
            click: () => onSelectCountry(country.name),
          }}
        >
          <Popup>{country.name}</Popup>
        </Marker>
      ))}

            {flows.map((flow, index) => {
        const from = countryCoordinates[flow.from];
        const to = countryCoordinates[flow.to];

        if (!from || !to) return null;

        return (
          <Polyline
            key={index}
            positions={[from, to]}
            pathOptions={{
              color: "#38BDF8",
              weight: 2,
              opacity: 0.7,
            }}
          />
        );
      })}
        </MapContainer>
  );
}