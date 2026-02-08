"use client";

import { useState, useEffect } from "react";
// Dynamic import for Leaflet to disable SSR
import dynamic from 'next/dynamic';
import { Expand, X } from "lucide-react";
import 'leaflet/dist/leaflet.css';
import L from "leaflet";

// Dynamically import MapContainer and other Leaflet components
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

interface MapPreviewProps {
    complaints: any[];
}

// Leaflet icon fix for Next.js
const fixLeafletIcon = async () => {
    try {
        // @ts-ignore
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
    } catch (e) {
        console.error("Leaflet icon fix failed", e);
    }
};

export default function MapPreview({ complaints }: MapPreviewProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fixLeafletIcon();
    }, []);

    // Filter complaints that have coordinates in "lat, long" format
    // Hardcoded markers (Mumbai sample locations)
    // Hardcoded markers (Expanded Mumbai sample locations)
    const markers = [
        // 🔴 Road
        {
            title: "Pothole near Andheri Station",
            department: "Road",
            lat: 19.1197,
            lng: 72.8468
        },
        {
            title: "Broken divider near Lokhandwala",
            department: "Road",
            lat: 19.1334,
            lng: 72.8296
        },
        {
            title: "Cracked road near DN Nagar",
            department: "Road",
            lat: 19.1245,
            lng: 72.8402
        },
        {
            title: "Traffic signal malfunction near Versova",
            department: "Road",
            lat: 19.1370,
            lng: 72.8106
        },

        // 🔵 Water
        {
            title: "Water leakage in Dadar",
            department: "Water",
            lat: 19.0176,
            lng: 72.8562
        },
        {
            title: "Pipeline burst near Andheri East",
            department: "Water",
            lat: 19.1145,
            lng: 72.8720
        },

        // 🟡 Electrical
        {
            title: "Streetlight issue in Bandra",
            department: "Electrical",
            lat: 19.0607,
            lng: 72.8363
        },

        // 🟢 Sanitation
        {
            title: "Garbage overflow in Kurla",
            department: "Sanitation",
            lat: 19.0728,
            lng: 72.8826
        },
        {
            title: "Trash pile near Andheri Metro",
            department: "Sanitation",
            lat: 19.1213,
            lng: 72.8505
        }
    ];



    // Default center (Mumbai)
    let center: [number, number] = [19.0760, 72.8777];

    // If we have markers, try to center on them (average)
    if (markers.length > 0) {
        const avgLat = markers.reduce((sum, m) => sum + m.lat, 0) / markers.length;
        const avgLng = markers.reduce((sum, m) => sum + m.lng, 0) / markers.length;
        center = [avgLat, avgLng];
    }

    if (!mounted) return <div className="w-full aspect-square bg-muted/20 animate-pulse rounded-xl" />;

    // Create colored icons function
    // We use a simple circular div icon
    const getIcon = (dept: string) => {

        const colors: Record<string, string> = {
            'Road': '#ef4444',      // Red
            'Water': '#3b82f6',     // Blue
            'Electrical': '#eab308', // Yellow
            'Sanitation': '#22c55e'  // Green
        };
        const color = colors[dept] || '#8884d8';

        // @ts-ignore
        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        });
    };

    const MapContent = ({ fullscreen = false }) => (
        <MapContainer
            center={center}
            zoom={fullscreen ? 12 : 11}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={fullscreen}
            dragging={fullscreen}
            doubleClickZoom={fullscreen}
            zoomControl={fullscreen}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                className="map-tiles"
            />
            {markers.map((mark, idx) => (
                <Marker key={idx} position={[mark.lat, mark.lng]} icon={getIcon(mark.department)}>
                    <Popup>
                        <div className="text-sm">
                            <strong className="block mb-1">{mark.title}</strong>
                            <span className={`px-2 py-0.5 rounded text-xs text-white ${mark.department === 'Road' ? 'bg-red-500' :
                                mark.department === 'Water' ? 'bg-blue-500' :
                                    mark.department === 'Electrical' ? 'bg-yellow-500' :
                                        'bg-green-500'
                                }`}>
                                {mark.department}
                            </span>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );

    return (
        <>
            <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-border/50 shadow-lg group">
                <MapContent />

                {/* Overlay for non-interactive preview */}
                <div
                    className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors cursor-pointer z-[400] flex items-center justify-center pointer-events-auto"
                    onClick={() => setIsExpanded(true)}
                >
                    <div className="bg-background/90 backdrop-blur text-foreground px-4 py-2 rounded-full shadow-lg font-medium text-sm flex items-center gap-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <Expand size={16} />
                        Explore Impact Map
                    </div>
                </div>
            </div>

            {/* Expanded Modal */}
            {isExpanded && (
                <div className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-card rounded-2xl shadow-2xl overflow-hidden border border-border">
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="absolute top-4 right-4 z-[1000] p-2 bg-background/80 backdrop-blur rounded-full hover:bg-accent transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <MapContent fullscreen={true} />
                    </div>
                </div>
            )}
        </>
    );
}
