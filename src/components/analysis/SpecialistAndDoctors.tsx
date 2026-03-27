"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { motion } from "framer-motion";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import type { DoctorCard } from "@/types/analysis";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

type Props = {
  specialist: string;
  doctors: DoctorCard[];
  userLocation?: { lat: number; lng: number } | null;
};

export function SpecialistAndDoctors({ specialist, doctors, userLocation = null }: Props) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const center = userLocation
    ? { latitude: userLocation.lat, longitude: userLocation.lng }
    : { latitude: 28.6139, longitude: 77.209 };
  const markerPoints = doctors.map((doc, index) => {
    const spread = index - (doctors.length - 1) / 2;
    return {
      ...doc,
      latitude: center.latitude + spread * 0.01,
      longitude: center.longitude + (index % 2 === 0 ? 1 : -1) * (0.008 + index * 0.001),
    };
  });

  return (
    <motion.section {...fadeUp} className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Recommended specialist
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-slate-900">{specialist}</h3>
        <p className="mt-2 text-sm text-slate-600">
          A specialist can confirm the diagnosis and guide treatment.
        </p>
        <button className="btn-primary mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(31,103,242,0.25)] transition hover:-translate-y-px">
          Find Doctors Near You
        </button>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">Nearby doctors</h3>
          <span className="text-xs font-semibold text-slate-500">Updated just now</span>
        </div>
        <div className="mt-5 space-y-5">
          <div className="h-56 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 sm:h-64 lg:h-72">
            {mapboxToken ? (
              <Map
                initialViewState={{
                  longitude: center.longitude,
                  latitude: center.latitude,
                  zoom: 12,
                }}
                mapStyle="mapbox://styles/mapbox/light-v11"
                mapboxAccessToken={mapboxToken}
                style={{ width: "100%", height: "100%" }}
              >
                <NavigationControl position="top-right" />
                {markerPoints.map((point, index) => (
                  <Marker
                    key={`${point.name}-${index}`}
                    longitude={point.longitude}
                    latitude={point.latitude}
                    anchor="bottom"
                  >
                    <div className="h-4 w-4 rounded-full border-2 border-white bg-[#2fb1a7] shadow-[0_0_0_4px_rgba(47,177,167,0.2)]" />
                  </Marker>
                ))}
              </Map>
            ) : (
              <div className="flex h-full items-center justify-center bg-slate-50 px-4 text-center text-xs font-medium text-slate-500">
                Map preview unavailable. Add NEXT_PUBLIC_MAPBOX_TOKEN to enable nearby markers.
              </div>
            )}
          </div>

          <div className="grid max-h-72 gap-4 overflow-y-auto pr-1">
            {doctors.map((doc) => (
              <div
                key={doc.name}
                className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{doc.name}</p>
                  <p className="text-xs text-slate-500">{doc.specialty}</p>
                  <p className="mt-2 text-xs font-semibold text-[#2b7f74]">? {doc.rating}</p>
                </div>
                <div className="text-xs text-slate-500">
                  <p>{doc.distance}</p>
                  <p className="font-semibold text-slate-700">{doc.fee}</p>
                </div>
                <button className="btn-outline-accent rounded-full border px-4 py-2 text-xs font-semibold transition">
                  Book appointment
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

