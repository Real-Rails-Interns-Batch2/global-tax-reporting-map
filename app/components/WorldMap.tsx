"use client";
import { useEffect, useRef } from "react";
import { flows } from "../data/flows";
import { countries } from "../data/countries";

const statusColors: Record<string, string> = {
  Active:          "#4ADE80",
  Partial:         "#FBBF24",
  Pending:         "#EF4444",
  "Non-Participant": "#6B7280",
};

const riskColors: Record<string, string> = {
  Low:    "#4ADE80",
  Medium: "#FBBF24",
  High:   "#EF4444",
};

const volumeColors: Record<string, string> = {
  High:   "#38BDF8",
  Medium: "#A78BFA",
  Low:    "#FBBF2488",
};

const coordMap: Record<string, [number, number]> = {};
countries.forEach((c) => { coordMap[c.name] = [c.lat, c.lng]; });

type Props = {
  onSelectCountry: (name: string) => void;
};

export default function WorldMap({ onSelectCountry }: Props) {
  const mapRef      = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current || initialized.current) return;
    initialized.current = true;

    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      const map = L.map(mapRef.current!, {
        center: [20, 10],
        zoom: 2,
        zoomControl: true,
        preferCanvas: true,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap © CartoDB",
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      // Pulse animation
      const style = document.createElement("style");
      style.innerHTML = `
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.8; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        .pulse-ring {
          position: absolute;
          border-radius: 50%;
          animation: pulse-ring 1.4s ease-out infinite;
        }
      `;
      document.head.appendChild(style);

      // Draw flow lines
      flows.forEach((flow) => {
        const from = coordMap[flow.from];
        const to   = coordMap[flow.to];
        if (!from || !to) return;

        const color = volumeColors[flow.volume];
        const line  = L.polyline([from, to], {
          color,
          weight:    flow.volume === "High" ? 2 : 1.5,
          opacity:   flow.volume === "High" ? 0.7 : 0.45,
          dashArray: flow.volume === "Low" ? "4, 6" : undefined,
        }).addTo(map);

        line.bindTooltip(
          `<div style="font-family:Inter,sans-serif;font-size:11px;color:#fff;background:#0B1117;border:1px solid #1F2937;border-radius:6px;padding:4px 8px">
            ${flow.from} → ${flow.to}<br/>
            <span style="color:${color}">${flow.volume} Volume</span>
          </div>`,
          { sticky: true, opacity: 1 }
        );
      });

      // Draw markers for all 24 countries
      countries.forEach((c) => {
        const color     = statusColors[c.status] ?? "#6B7280";
        const riskColor = riskColors[c.reportingRisk] ?? "#6B7280";

        const icon = L.divIcon({
          className: "",
          html: `
            <div style="position:relative;width:32px;height:32px;">
              <div class="pulse-ring" style="width:16px;height:16px;background:${color};top:8px;left:8px;"></div>
              <div style="position:absolute;width:22px;height:22px;border-radius:50%;border:1.5px solid ${color};top:5px;left:5px;opacity:0.4;"></div>
              <div style="position:absolute;width:12px;height:12px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 12px ${color},0 0 24px ${color}88;top:10px;left:10px;"></div>
            </div>
          `,
          iconSize:   [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([c.lat, c.lng], { icon });

        marker.bindPopup(`
          <div style="font-family:Inter,sans-serif;min-width:200px;background:#0B1117;color:#fff;padding:2px">
            <p style="color:${color};font-weight:700;font-size:13px;margin:0 0 3px">${c.name}</p>
            <p style="color:#9CA3AF;font-size:11px;margin:0 0 8px">${c.region} · Joined ${c.adoptionYear}</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">
              <div style="background:#030712;border:1px solid #1F2937;border-radius:6px;padding:5px">
                <p style="color:#6B7280;font-size:9px;margin:0 0 2px">STATUS</p>
                <p style="color:${color};font-size:11px;font-weight:600;margin:0">${c.status}</p>
              </div>
              <div style="background:#030712;border:1px solid #1F2937;border-radius:6px;padding:5px">
                <p style="color:#6B7280;font-size:9px;margin:0 0 2px">RISK</p>
                <p style="color:${riskColor};font-size:11px;font-weight:600;margin:0">${c.reportingRisk}</p>
              </div>
              <div style="background:#030712;border:1px solid #1F2937;border-radius:6px;padding:5px">
                <p style="color:#6B7280;font-size:9px;margin:0 0 2px">TRANSPARENCY</p>
                <p style="color:#38BDF8;font-size:11px;font-weight:600;margin:0">${c.transparencyScore}/100</p>
              </div>
              <div style="background:#030712;border:1px solid #1F2937;border-radius:6px;padding:5px">
                <p style="color:#6B7280;font-size:9px;margin:0 0 2px">YEAR</p>
                <p style="color:#fff;font-size:11px;font-weight:600;margin:0">${c.adoptionYear}</p>
              </div>
            </div>
          </div>
        `, { maxWidth: 240 });

        marker.on("mouseover", () => marker.openPopup());
        marker.on("mouseout",  () => marker.closePopup());
        marker.on("click",     () => onSelectCountry(c.name));

        marker.addTo(map);
      });

      mapInstance.current = map;
    })();
  }, []);

  return (
    <div ref={mapRef} style={{ width: "100%", height: "100%", background: "#0B1117" }} />
  );
}
