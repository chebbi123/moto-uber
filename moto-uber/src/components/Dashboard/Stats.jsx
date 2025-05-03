import React from 'react';
import Card from '../Card'; // Import Card component

export default function Stats({ stats }) {
  if (!stats) return <p>Loading statistics...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card title="Total Users">
        <p className="text-2xl">{stats.totalUsers}</p>
      </Card>
      <Card title="Total Drivers">
        <p className="text-2xl">{stats.totalDrivers}</p>
      </Card>
      <Card title="Total Rides">
        <p className="text-2xl">{stats.totalRides}</p>
      </Card>
      <Card title="Active Rides">
        <p className="text-2xl">{stats.activeRides}</p>
      </Card>
      <Card title="Total Revenue">
        <p className="text-2xl">${stats.totalRevenue.toFixed(2)}</p>
      </Card>
    </div>
  );
}
