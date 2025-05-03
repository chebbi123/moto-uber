import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'; // Import Leaflet components
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

export default function LocationTracking() {
  const { t } = useTranslation();
  const [lat, setLat] = useState(51.505); // Default latitude
  const [lng, setLng] = useState(-0.09); // Default longitude
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Custom component to update map center
  function UpdateMapCenter({ lat, lng }) {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lng], map.getZoom());
    }, [lat, lng, map]);
    return null;
  }

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(t('locationTracking.gpsNotSupported'));
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLat(latitude);
        setLng(longitude);

        try {
          const token = localStorage.getItem('token');
          await axios.put(
            'http://localhost:5000/api/drivers/location',
            { lat: latitude, lng: longitude },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setMessage(t('locationTracking.success'));
          setError('');
        } catch (err) {
          setError(t('locationTracking.error'));
          setMessage('');
        }
      },
      (err) => {
        setError(t('locationTracking.gpsError'));
        setMessage('');
      }
    );

    return () => navigator.geolocation.clearWatch(watchId); // Cleanup on component unmount
  }, [t]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 px-2">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 mb-6">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8 tracking-tight">
          {t('locationTracking.title')}
        </h2>
        {message && (
          <p className="text-green-600 text-sm mb-4 text-center font-medium">{message}</p>
        )}
        {error && (
          <p className="text-red-600 text-sm mb-4 text-center font-medium">{error}</p>
        )}
      </div>
      <div className="w-full max-w-4xl h-96">
        <MapContainer center={[lat, lng]} zoom={13} className="h-full w-full rounded-lg shadow-lg">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[lat, lng]}>
            <Popup>{t('locationTracking.currentLocation')}</Popup>
          </Marker>
          <UpdateMapCenter lat={lat} lng={lng} />
        </MapContainer>
      </div>
    </div>
  );
}
