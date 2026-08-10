// Document Upload Component + Mock Verification Engine
import React, { useState } from 'react';

// Document Upload Component
export function DocumentUploadPanel({ dli, onUploadComplete }) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => {
      // Accept PDFs, images, and documents
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      return validTypes.includes(file.type) && file.size < 10 * 1024 * 1024; // 10MB max
    });

    setFiles([...files, ...validFiles]);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(i);
      }

      // In real app, send to backend
      const uploadedDocs = files.map((file, index) => ({
        id: `doc_${Date.now()}_${index}`,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        dliCode: dli.code,
        status: 'verified'
      }));

      onUploadComplete(uploadedDocs);
      setFiles([]);
      setUploadProgress(0);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Upload Evidence for {dli.code}
      </h3>

      {/* Drag and Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          dragActive ? 'border-[#FFD700] bg-yellow-50' : 'border-gray-300'
        }`}
      >
        <div className="mb-4">
          <svg
            className="w-16 h-16 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        <p className="text-gray-600 font-500 mb-2">
          Drag and drop your files here
        </p>
        <p className="text-sm text-gray-500 mb-4">
          or click to select from your computer
        </p>

        <input
          type="file"
          multiple
          onChange={handleChange}
          className="hidden"
          id="file-input"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
        <label
          htmlFor="file-input"
          className="inline-block px-6 py-2 bg-[#001F3F] text-white rounded-lg font-600 cursor-pointer hover:bg-[#003366]"
        >
          Browse Files
        </label>

        <p className="text-xs text-gray-500 mt-3">
          Supported: PDF, DOC, DOCX, JPG, PNG (Max 10MB each)
        </p>
      </div>

      {/* Files List */}
      {files.length > 0 && (
        <div className="mt-6">
          <h4 className="font-600 text-gray-900 mb-3">
            Ready to Upload ({files.length} file{files.length !== 1 ? 's' : ''})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200"
              >
                <div className="flex items-center gap-3 flex-1">
                  <svg
                    className="w-5 h-5 text-[#001F3F]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                  </svg>
                  <div className="flex-1">
                    <p className="font-500 text-gray-900 text-sm truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setFiles(files.filter((_, i) => i !== index))
                  }
                  className="text-red-600 hover:text-red-700 font-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#FFD700] h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full mt-4 px-6 py-3 bg-[#FFD700] hover:bg-yellow-500 text-[#001F3F] font-bold rounded-lg disabled:opacity-50 transition-colors"
          >
            {uploading ? `Uploading (${uploadProgress}%)` : 'Upload Files'}
          </button>
        </div>
      )}
    </div>
  );
}

// Mock Verification Engine
export class MockVerificationEngine {
  calculateReadiness(state, dlis) {
    let totalScore = 0;
    const scores = {
      deadlinesMet: 0,
      documentsUploaded: 0,
      qualityScore: 0,
      timelineCompliance: 0
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Check deadlines met (40% weight)
    const deadlinesMet = dlis.filter(dli => {
      const deadline = new Date(dli.deadline);
      deadline.setHours(0, 0, 0, 0);
      return deadline >= today || dli.status === 'completed';
    }).length;

    scores.deadlinesMet = (deadlinesMet / dlis.length) * 100;
    totalScore += scores.deadlinesMet * 0.4;

    // 2. Check documents uploaded (30% weight)
    const docsUploaded = dlis.filter(dli => dli.documentsCount > 0).length;
    scores.documentsUploaded = (docsUploaded / dlis.length) * 100;
    totalScore += scores.documentsUploaded * 0.3;

    // 3. Document quality (20% weight)
    scores.qualityScore = 85; // Default 85% quality for demo
    totalScore += scores.qualityScore * 0.2;

    // 4. Timeline compliance (10% weight)
    const completedOnTime = dlis.filter(dli => {
      const deadline = new Date(dli.deadline);
      deadline.setHours(0, 0, 0, 0);
      const completed = new Date(dli.completedDate || today);
      completed.setHours(0, 0, 0, 0);
      return dli.status === 'completed' && completed <= deadline;
    }).length;

    scores.timelineCompliance = (completedOnTime / dlis.length) * 100;
    totalScore += scores.timelineCompliance * 0.1;

    // Determine if ready for IVA
    const ivaReady = totalScore >= 75;

    // Generate gaps
    const gaps = [];
    if (scores.deadlinesMet < 80) gaps.push('Some deadlines are at risk or missed');
    if (scores.documentsUploaded < 80) gaps.push('Need more document evidence');
    if (scores.qualityScore < 80) gaps.push('Improve document quality/completeness');
    if (scores.timelineCompliance < 80) gaps.push('Some deliverables completed late');

    // Generate recommendations
    const recommendations = [];
    if (scores.deadlinesMet < 80) recommendations.push('Prioritize overdue DLIs - meet deadlines immediately');
    if (scores.documentsUploaded < 80) recommendations.push('Upload supporting documents for each DLI');
    if (scores.qualityScore < 80) recommendations.push('Ensure documents are complete and of high quality');
    if (ivaReady) recommendations.push('State is ready for IVA verification');

    return {
      state,
      overallReadiness: Math.round(totalScore),
      ivaReady,
      ivaReadyPercentage: Math.round(totalScore),
      scores,
      gaps,
      recommendations,
      assessmentDate: new Date().toISOString(),
      daysToReadiness: ivaReady ? 0 : Math.ceil((100 - totalScore) / 10)
    };
  }
}

// Readiness Score Display Component
export function ReadinessScoreCard({ verification }) {
  return (
    <div className="bg-gradient-to-br from-[#001F3F] to-[#003366] text-white rounded-lg shadow-lg p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Overall Score */}
        <div className="flex items-center justify-center">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />

              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#FFD700"
                strokeWidth="8"
                strokeDasharray={`${(verification.overallReadiness / 100) * 282.6} 282.6`}
                strokeLinecap="round"
              />
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold">{verification.overallReadiness}%</div>
              <div className="text-xs text-[#FFD700] font-600">READY</div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-200 mb-2">IVA Readiness Status</p>
            <div
              className={`px-4 py-3 rounded-lg font-bold text-center ${
                verification.ivaReady
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}
            >
              {verification.ivaReady ? '✅ READY FOR IVA' : '⚠️ NOT YET READY'}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-200 mb-2">Readiness Breakdown</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Deadlines Met:</span>
                <span className="font-600">{Math.round(verification.scores.deadlinesMet)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Documents Uploaded:</span>
                <span className="font-600">{Math.round(verification.scores.documentsUploaded)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Document Quality:</span>
                <span className="font-600">{Math.round(verification.scores.qualityScore)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Timeline Compliance:</span>
                <span className="font-600">{Math.round(verification.scores.timelineCompliance)}%</span>
              </div>
            </div>
          </div>

          {!verification.ivaReady && (
            <div className="text-sm bg-yellow-500 bg-opacity-20 border border-[#FFD700] rounded-lg p-3">
              <p className="font-600 mb-1">Days to 100% Ready:</p>
              <p>{verification.daysToReadiness} days</p>
            </div>
          )}
        </div>
      </div>

      {/* Gaps and Recommendations */}
      <div className="mt-8 pt-8 border-t border-gray-400">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Gaps */}
          <div>
            <h4 className="font-bold text-[#FFD700] mb-3">Gaps Identified</h4>
            {verification.gaps.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {verification.gaps.map((gap, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-red-400">•</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-green-300">No gaps - State is ready!</p>
            )}
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="font-bold text-[#FFD700] mb-3">Action Items</h4>
            <ul className="space-y-2 text-sm">
              {verification.recommendations.map((rec, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-[#FFD700]">→</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
