import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function PerformanceMetrics() {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem('token');
      
          const response = await axios.get('http://localhost:5000/api/driver/performance', {
            headers: { Authorization: `Bearer ${token}` },
          });
          return response.data;
        } catch (error) {
          throw new Error('Failed to fetch driver performance metrics.');
        }
    };

    fetchMetrics();
  }, [t]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-200 via-teal-400 to-cyan-500 px-2">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center border border-gray-100">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8 tracking-tight">
          {t('performanceMetrics.title')}
        </h2>
        {error && <p className="text-red-600 text-sm mb-4 font-medium">{error}</p>}
        {metrics ? (
          <div>
            <p className="text-xl font-semibold text-gray-700 mb-4">
              {t('performanceMetrics.completedRides')}: {metrics.completedRides}
            </p>
            <p className="text-xl font-semibold text-gray-700">
              {t('performanceMetrics.averageRating')}: <span className="text-green-600 font-bold">{metrics.averageRating.toFixed(1)}</span>
            </p>
          </div>
        ) : (
          <p className="text-gray-500">{t('performanceMetrics.loading')}</p>
        )}
      </div>
    </div>
  );
}
