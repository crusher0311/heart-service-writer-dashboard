import React, { useState } from 'react';
import { Activity, BarChart3 } from 'lucide-react';
import ManagementView from './ManagementView';
import AnalyticsView from './AnalyticsView';

const ServiceWriterDashboard = () => {
  const [currentPage, setCurrentPage] = useState('management');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Service Writer Performance Dashboard</h1>
            <p className="text-gray-600">Weekly KPI tracking and performance analysis</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage('management')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                currentPage === 'management' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Activity size={20} />
              Management
            </button>
            <button
              onClick={() => setCurrentPage('analytics')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                currentPage === 'analytics' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BarChart3 size={20} />
              Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Render Current Page */}
      {currentPage === 'management' ? <ManagementView /> : <AnalyticsView />}
    </div>
  );
};

export default ServiceWriterDashboard;