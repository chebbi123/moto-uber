import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { io } from 'socket.io-client';
import { useStore } from '../context/StoreContext';

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ['websocket', 'polling'],
});

export default function RideTracking({ rideId }) {
  const { state, dispatch } = useStore();
  const { location, status } = state;

  useEffect(() => {
    socket.emit('joinRide', rideId);

    const handleLocationUpdate = (newLocation) => {
      dispatch({ type: 'SET_LOCATION', payload: newLocation });
    };

    const handleStatusUpdate = (newStatus) => {
      dispatch({ type: 'SET_STATUS', payload: newStatus });
    };

    socket.on('locationUpdate', handleLocationUpdate);
    socket.on('statusUpdate', handleStatusUpdate);

    return () => {
      socket.emit('leaveRide', rideId);
      socket.off('locationUpdate', handleLocationUpdate);
      socket.off('statusUpdate', handleStatusUpdate);
    };
  }, [rideId, dispatch]); // Only re-run when `rideId` changes

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Ride Tracking</h2>
      <p>Status: <span className="font-semibold">{status}</span></p>
      <div className="h-96 w-full mt-4">
        <MapContainer center={location} zoom={13} className="h-full w-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={location}>
            <Popup>Driver's Current Location</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
