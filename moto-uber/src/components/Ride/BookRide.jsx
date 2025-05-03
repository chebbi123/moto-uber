import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getDistance } from 'geolib';
import axios from 'axios';

// Fix default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition, setAddress }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);

      // Reverse geocoding to get the address
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then((response) => response.json())
        .then((data) => {
          setAddress(data.display_name || 'Unknown Location');
        })
        .catch(() => {
          setAddress('Unknown Location');
        });
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function BookRide() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupPosition, setPickupPosition] = useState(null);
  const [dropoffPosition, setDropoffPosition] = useState(null);
  const [distance, setDistance] = useState(null);
  const [price, setPrice] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const calculateDistanceAndPrice = async () => {
    if (!pickupPosition || !dropoffPosition) {
      setError('Please select both pickup and dropoff locations on the map.');
      setDistance(null);
      setPrice(null);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const distanceInMeters = getDistance(
        { latitude: pickupPosition.lat, longitude: pickupPosition.lng },
        { latitude: dropoffPosition.lat, longitude: dropoffPosition.lng }
      );
      const distanceInKm = (distanceInMeters / 1000).toFixed(2);
      setDistance(distanceInKm);

      // Fetch ride price from the backend
      const response = await axios.post(
        'http://localhost:5000/api/rides/estimate-fare',
        { pickup: { lat: pickupPosition.lat, lng: pickupPosition.lng }, dropoff: { lat: dropoffPosition.lat, lng: dropoffPosition.lng } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { estimatedFare } = response.data;

      setPrice(estimatedFare.toFixed(2));
      setError('');
    } catch (err) {
      setError('Failed to calculate price. Please try again.');
      setPrice(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pickupPosition || !dropoffPosition) {
      setError('Please select both pickup and dropoff locations on the map.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/rides/request',
        {
          pickup: { address: pickup, coordinates: pickupPosition },
          dropoff: { address: dropoff, coordinates: dropoffPosition },
          estimatedFare: price,
          distance,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Ride request sent successfully! Waiting for driver acceptance.');
      setError('');
    } catch (err) {
      setError('Failed to send ride request. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">Book a Ride</h2>
        {message && <p className="text-green-600 mb-4 text-center font-medium">{message}</p>}
        {error && <p className="text-red-600 mb-4 text-center font-medium">{error}</p>}
        <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div>
            <input
              type="text"
              placeholder="Pickup Location"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
            <input
              type="text"
              placeholder="Dropoff Location"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
            <button
              type="button"
              onClick={calculateDistanceAndPrice}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300 shadow mb-4"
            >
              Calculate Distance & Price
            </button>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-400 focus:outline-none transition duration-300 shadow"
            >
              Send Ride Request
            </button>
            {distance && (
              <p className="text-lg font-medium mt-4 text-center">
                Distance: <span className="text-green-600 font-bold">{distance} km</span>
              </p>
            )}
            {price && (
              <p className="text-lg font-medium mt-2 text-center">
                Estimated Price: <span className="text-blue-600 font-bold">{price} TND</span>
              </p>
            )}
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Select Pickup Location</h3>
              <MapContainer
                center={[36.8065, 10.1815]}
                zoom={13}
                style={{ height: '200px', width: '100%' }}
                className="rounded-lg overflow-hidden border border-gray-200"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker
                  position={pickupPosition}
                  setPosition={setPickupPosition}
                  setAddress={setPickup}
                />
              </MapContainer>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Select Dropoff Location</h3>
              <MapContainer
                center={[36.8065, 10.1815]}
                zoom={13}
                style={{ height: '200px', width: '100%' }}
                className="rounded-lg overflow-hidden border border-gray-200"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker
                  position={dropoffPosition}
                  setPosition={setDropoffPosition}
                  setAddress={setDropoff}
                />
              </MapContainer>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
