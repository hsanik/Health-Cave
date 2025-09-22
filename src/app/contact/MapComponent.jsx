'use client'

import { useEffect, useRef } from 'react'

export default function MapComponent() {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    // Dynamically import Leaflet only on client side
    const initMap = async () => {
      const L = await import('leaflet')
      
      // Fix for default markers in Next.js
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      })

      if (mapRef.current && !mapInstanceRef.current) {

        const Coordinates = [23.753, 90.3789];
        // Initialize map centered on the office location
        const map = L.map(mapRef.current).setView(Coordinates, 13); // Baltimore, MD coordinates
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map)

        // Add custom marker for HealthCave office
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              background: #435ba1;
              width: 30px;
              height: 30px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 3px solid #43d5cb;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                transform: rotate(45deg);
                color: white;
                font-weight: bold;
                font-size: 16px;
              ">H</div>
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 30]
        })

        // Add marker for HealthCave office
        L.marker(Coordinates, { icon: customIcon })
          .addTo(map)
          .bindPopup(
            `
            <div style="text-align: center; padding: 10px;">
              <h3 style="margin: 0 0 8px 0; color: #435ba1; font-weight: bold;">HealthCave</h3>
              <p style="margin: 0; color: #515151; font-size: 14px;">
                71/A Satmasjid Road
                      <br />
                      Dhanmondi, Dhaka 1209
                      <br />
                      Bangladesh
              </p>
              <p style="margin: 8px 0 0 0; color: #43d5cb; font-size: 12px; font-weight: 500;">
                📞 +880 (171) 123-4567
              </p>
            </div>
          `
          )
          .openPopup();

        mapInstanceRef.current = map
      }
    }

    initMap()

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div 
      ref={mapRef} 
      style={{ 
        height: '100%', 
        width: '100%',
        borderRadius: '8px'
      }}
    />
  )
}
