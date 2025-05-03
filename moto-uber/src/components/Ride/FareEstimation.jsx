import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function FareEstimation() {
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [fare, setFare] = useState(null);
  const [error, setError] = useState('');
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [userLocation, setUserLocation] = useState(null); // State for user's location

  useEffect(() => {
    // Auto-locate the user's position using GPS
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      () => {
        setError('Failed to retrieve your location. Please enable GPS.');
      }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pickup || !dropoff) {
      setError('Please select both pickup and dropoff locations.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/rides/estimate-fare',
        { pickup: { lat: pickup.lat, lng: pickup.lng }, dropoff: { lat: dropoff.lat, lng: dropoff.lng } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { estimatedFare, distance, duration } = response.data;
      setFare(estimatedFare);
      setDistance(distance);
      setDuration(duration);
      setError('');
    } catch (err) {
      console.error('Error estimating fare:', err);
      setError('Failed to get the price. Please try again.');
      setFare(null);
      setDistance(null);
      setDuration(null);
    }
  };

  const PickupMap = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPickup({ lat, lng });
      },
    });
    return null;
  };

  const DropoffMap = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setDropoff({ lat, lng });
      },
    });
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-2">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-4xl border border-gray-100 mb-6">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8 tracking-tight">Fare Estimation</h2>
        {error && <p className="text-red-600 text-sm mb-4 text-center font-medium">{error}</p>}
        {fare && (
          <div className="text-center mb-4">
            <p className="text-green-600 text-lg font-bold">Estimated Fare: {fare.toFixed(2)} TND</p>
            <p className="text-gray-700 text-sm">Distance: {distance.toFixed(2)} km</p>
            <p className="text-gray-700 text-sm">Duration: {duration} mins</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-bold mb-2">Select Pickup Location</h3>
            <MapContainer
              center={userLocation || [36.8065, 10.1815]} // Use user's location if available
              zoom={13}
              className="h-64 w-full rounded-lg shadow-lg"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <PickupMap />
              {pickup && (
                <Marker position={[pickup.lat, pickup.lng]}>
                  <Popup>Pickup Location</Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Select Dropoff Location</h3>
            <MapContainer
              center={userLocation || [36.8065, 10.1815]} // Use user's location if available
              zoom={13}
              className="h-64 w-full rounded-lg shadow-lg"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <DropoffMap />
              {dropoff && (
                <Marker position={[dropoff.lat, dropoff.lng]}>
                  <Popup>Dropoff Location</Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300 shadow mt-6"
        >
          Estimate Fare
        </button>
      </form>
    </div>
  );
}
