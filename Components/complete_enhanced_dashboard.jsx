// Complete Enhanced Dashboard - All Features Integrated
// This shows how all components work together

import React, { useState, useEffect } from 'react';
import { GovveritasHeader } from './govveritas_logo';
import { DLIAlertsList } from './blinking_deadline_alert';
import { MockVerificationEngine, ReadinessScoreCard, DocumentUploadPanel } from './document_upload_verification';
import { PDFExportButton } from './pdf_export_report';

// Sample data - Replace with real API calls
const ABIA_STATE_DLIS = [
  {
    code: 'DLI-HE-001',
    name: 'Functional primary health centres upgraded',
    program: 'Health Sector Programme',
    deadline: '2025-12-31',
    status: 'in_progress',
    documentsCount: 1,
    completedDate: null
  },
  {
    code: 'DLI-HE-002',
    name: 'Health workers trained on health management information system',
    program: 'Health Sector Programme',
    deadline: '2025-11-30',
    status: 'completed',
    documentsCount: 2,
    completedDate: '2025-11-15'
  },
  {
    code: 'DLI-ED-001',
    name: 'Classrooms rehabilitated with learning materials',
    program: 'Education Programme',
    deadline: '2025-09-30',
    status: 'in_progress',
    documentsCount: 3,
    completedDate: null
  },
  {
    code: 'DLI-ED-002',
    name: 'Teachers trained on modern teaching methods',
    program: 'Education Programme',
    deadline: '2025-10-31',
    status: 'pending',
    documentsCount: 0,
    completedDate: null
  },
  {
    code: 'DLI-WS-001',
    name: 'Water supply infrastructure improved',
    program: 'Water & Sanitation Programme',
    deadline: '2025-08-31',
    status: 'completed',
    documentsCount: 4,
    completedDate: '2025-08-20'
  },
  {
    code: 'DLI-AG-001',
    name: 'Agricultural productivity training completed',
    program: 'Agricultural Development',
    deadline: '2025-07-31',
    status: 'completed',
    documentsCount: 2,
    completedDate: '2025-07-25'
  },
];

export default function EnhancedDashboard() {
  const [userState] = useState(() => {
    return localStorage.getItem('userState') || 'Abia';
  });

  const [dlis] = useState(ABIA_STATE_DLIS);
  const [activeTab, setActiveTab] = useState('overview');
  const [verification, setVerification] = useState(null);

  // Calculate verification on mount and when data changes
  useEffect(() => {
    const engine = new MockVerificationEngine();
    const result = engine.calculateReadiness(userState, dlis);
    setVerification(result);
  }, [dlis, userState]);

  // Count statistics
  const completedCount = dlis.filter(d => d.status === 'completed').length;
  const inProgressCount = dlis.filter(d => d.status === 'in_progress').length;
  const pendingCount = dlis.filter(d => d.status === 'pending').length;
  const totalDocuments = dlis.reduce((sum, d) => sum + d.documentsCount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <GovveritasHeader stateName={userState} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#001F3F] to-[#003366] text-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome to {userState} State Dashboard
          </h1>
          <p className="text-lg opacity-90">
            World Bank HOPE-GOV Programme - Compliance Readiness Platform
          </p>
          <p className="text-sm opacity-75 mt-2">
            Last Updated: {new Date().toLocaleString('en-NG')}
          </p>
        </div>

        {/* Quick Stats */}
        {verification && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {/* Overall Readiness */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#FFD700]">
              <p className="text-sm text-gray-600 font-500">Overall Readiness</p>
              <p className="text-4xl font-bold text-[#001F3F] mt-2">
                {verification.overallReadiness}%
              </p>
              <p className={`text-xs font-600 mt-2 ${
                verification.ivaReady ? 'text-green-600' : 'text-red-600'
              }`}>
                {verification.ivaReady ? '✓ Ready for IVA' : '⚠ Not Ready'}
              </p>
            </div>

            {/* Completed */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <p className="text-sm text-gray-600 font-500">Completed</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{completedCount}</p>
              <p className="text-xs text-gray-600 mt-2">DLIs finished</p>
            </div>

            {/* In Progress */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 font-500">In Progress</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{inProgressCount}</p>
              <p className="text-xs text-gray-600 mt-2">DLIs active</p>
            </div>

            {/* Pending */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
              <p className="text-sm text-gray-600 font-500">Pending</p>
              <p className="text-4xl font-bold text-yellow-600 mt-2">{pendingCount}</p>
              <p className="text-xs text-gray-600 mt-2">DLIs not started</p>
            </div>

            {/* Total Documents */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#001F3F]">
              <p className="text-sm text-gray-600 font-500">Documents</p>
              <p className="text-4xl font-bold text-[#001F3F] mt-2">{totalDocuments}</p>
              <p className="text-xs text-gray-600 mt-2">Evidence uploaded</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-600 border-b-2 ${
              activeTab === 'overview'
                ? 'border-[#FFD700] text-[#001F3F]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab('dlis')}
            className={`px-6 py-3 font-600 border-b-2 ${
              activeTab === 'dlis'
                ? 'border-[#FFD700] text-[#001F3F]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            📋 DLI Tracker
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-6 py-3 font-600 border-b-2 ${
              activeTab === 'reports'
                ? 'border-[#FFD700] text-[#001F3F]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            📄 Reports
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && verification && (
          <div className="space-y-8">
            {/* Readiness Score Card */}
            <ReadinessScoreCard verification={verification} />

            {/* Next Steps */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-[#001F3F] mb-6">Next Steps</h2>
              
              {verification.recommendations.length > 0 ? (
                <div className="space-y-3">
                  {verification.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-[#FFD700] text-[#001F3F] font-bold flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-gray-700 pt-1">{rec}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-green-600 font-600">
                  ✓ All steps completed! State is ready for IVA verification.
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'dlis' && (
          <div className="space-y-8">
            {/* DLI Alerts List with Blinking Deadlines */}
            <DLIAlertsList dlis={dlis} state={userState} />

            {/* Document Upload for First DLI */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-[#001F3F] mb-6">Upload Evidence</h2>
              <DocumentUploadPanel
                dli={dlis[0]}
                onUploadComplete={(docs) => {
                  console.log('Documents uploaded:', docs);
                  // In real app: update state, recalculate verification
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'reports' && verification && (
          <div className="space-y-8">
            {/* Export Button */}
            <div className="flex justify-between items-center bg-white rounded-lg shadow-md p-6">
              <div>
                <h2 className="text-2xl font-bold text-[#001F3F]">IVA Report</h2>
                <p className="text-gray-600 mt-1">
                  Generate and download PDF report for World Bank submission
                </p>
              </div>
              <PDFExportButton state={userState} dlis={dlis} verification={verification} />
            </div>

            {/* Report Preview */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-bold text-[#001F3F] mb-6">Report Summary</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-4">State Information</h4>
                  <div className="space-y-3 text-sm">
                    <p><strong>State:</strong> {userState}</p>
                    <p><strong>Report Date:</strong> {new Date().toLocaleDateString('en-NG')}</p>
                    <p><strong>Total DLIs:</strong> {dlis.length}</p>
                    <p><strong>Assessment Type:</strong> Pre-IVA Readiness</p>
                    <p><strong>Document Count:</strong> {totalDocuments}</p>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Readiness Summary</h4>
                  <div className="space-y-3 text-sm">
                    <p>
                      <strong>Overall Readiness:</strong>
                      <span className="float-right text-lg font-bold text-[#FFD700]">
                        {verification.overallReadiness}%
                      </span>
                    </p>
                    <p>
                      <strong>IVA Ready:</strong>
                      <span className={`float-right font-bold ${
                        verification.ivaReady ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {verification.ivaReady ? '✓ Yes' : '✗ No'}
                      </span>
                    </p>
                    <p>
                      <strong>Days to 100%:</strong>
                      <span className="float-right font-bold">
                        {verification.daysToReadiness}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Gaps */}
              {verification.gaps.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4">Critical Gaps</h4>
                  <ul className="space-y-2 text-sm">
                    {verification.gaps.map((gap, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-red-600">⚠</span>
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#001F3F] text-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm opacity-75">
          <p>GovVeritas Lite - Compliance Readiness Platform</p>
          <p>World Bank HOPE-GOV Programme | Powered by Optegra Solutions</p>
          <p className="mt-2">For support: support@govveritas.gov.ng</p>
        </div>
      </footer>
    </div>
  );
}

// Export for testing
export { ABIA_STATE_DLIS };
