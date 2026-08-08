// frontend/src/pages/Dashboard.jsx
// GovVeritas Lite Dashboard Page

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import StatusBadge from '../components/Common/StatusBadge';

export default function DashboardPage({ user }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/dashboard/readiness`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setDashboardData(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return <LoadingSpinner />;
  }

  const { overall_readiness_percentage, eligibility_criteria, disbursement_linked_results, alerts } = dashboardData;

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-700 text-[#001F3F]">State Readiness Dashboard</h1>
          <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>

      {/* Readiness Overview Card */}
      <div className="bg-white rounded-12px shadow-md border-l-4 border-[#FFD700] p-8">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm font-500">Overall Readiness</p>
            <h2 className="text-5xl font-700 text-[#639922] mt-2">
              {overall_readiness_percentage}%
            </h2>
            <p className="text-gray-600 text-sm mt-3">
              If IVA verified today, you'd pass {overall_readiness_percentage}% of checks
            </p>
          </div>
          <div className="text-right">
            <div className="w-32 h-32 rounded-full border-8 border-[#639922] flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-700 text-[#639922]">{overall_readiness_percentage}%</p>
                <p className="text-xs text-gray-600 mt-1">Ready</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts && alerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-600 text-gray-800">Active Alerts</h3>
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border-l-4 ${
                alert.severity === 'critical'
                  ? 'bg-red-50 border-red-500'
                  : alert.severity === 'medium'
                  ? 'bg-yellow-50 border-yellow-500'
                  : 'bg-blue-50 border-blue-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-500 text-gray-800">{alert.title}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Due: {new Date(alert.due_date).toLocaleDateString()}
                    {alert.days_remaining >= 0 ? ` (${alert.days_remaining} days remaining)` : ` (${Math.abs(alert.days_remaining)} days overdue)`}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded text-xs font-500 ${
                  alert.severity === 'critical' ? 'bg-red-500 text-white' :
                  alert.severity === 'medium' ? 'bg-yellow-500 text-white' :
                  'bg-blue-500 text-white'
                }`}>
                  {alert.severity.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Eligibility Criteria Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-600 text-gray-800">Eligibility Criteria</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {eligibility_criteria.map((ec) => (
            <div key={ec.ec_code} className="bg-white rounded-lg shadow border border-gray-200 p-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-600 text-gray-800">{ec.ec_code}</h4>
                <StatusBadge status={ec.status} />
              </div>
              <p className="text-sm text-gray-600">{ec.ec_name}</p>
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-600">Progress</span>
                  <span className="text-sm font-600 text-gray-800">{ec.readiness_percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      ec.readiness_percentage === 100 ? 'bg-green-500' :
                      ec.readiness_percentage >= 85 ? 'bg-green-400' :
                      ec.readiness_percentage >= 60 ? 'bg-yellow-400' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${ec.readiness_percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disbursement Linked Results Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-600 text-gray-800">Implementation Milestones</h3>
        <div className="space-y-3">
          {disbursement_linked_results.map((dlr) => (
            <div
              key={dlr.dlr_code}
              onClick={() => navigate(`/dlr/${dlr.dlr_code}`)}
              className="bg-white rounded-lg shadow border border-gray-200 p-4 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex gap-3 items-start">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-500 text-sm flex-shrink-0 ${
                      dlr.status === 'complete' ? 'bg-green-500' :
                      dlr.status === 'good' ? 'bg-green-400' :
                      dlr.status === 'progressing' ? 'bg-yellow-400' :
                      'bg-red-500'
                    }`}>
                      {dlr.status === 'complete' ? '✓' :
                       dlr.status === 'good' ? '✓' :
                       dlr.status === 'progressing' ? '→' :
                       '!'}
                    </div>
                    <div>
                      <h4 className="font-600 text-gray-800">{dlr.dlr_code}: {dlr.dlr_name}</h4>
                      <p className="text-sm text-gray-600 mt-1">Click to view milestones and upload evidence</p>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="bg-gray-100 px-3 py-1 rounded text-sm font-600 text-gray-800 mb-2">
                    {dlr.readiness_percentage}% Ready
                  </div>
                  <p className="text-xs text-gray-600">{dlr.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/reports')}
          className="flex-1 px-6 py-3 bg-[#001F3F] text-white rounded-lg font-500 hover:bg-[#003366] transition-colors"
        >
          View Mock Verification Report
        </button>
        <button
          onClick={fetchDashboardData}
          className="flex-1 px-6 py-3 border-2 border-[#001F3F] text-[#001F3F] rounded-lg font-500 hover:bg-blue-50 transition-colors"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
}
