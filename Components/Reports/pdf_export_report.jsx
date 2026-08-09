// PDF Export Functionality for GovVeritas Lite
// Generates professional IVA submission reports

export class PDFReportGenerator {
  /**
   * Generate PDF Report for IVA Submission
   */
  static generateIVAReport(state, dlis, verification) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${state} - GovVeritas IVA Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    
    .page {
      page-break-after: always;
      padding: 40px;
      max-width: 8.5in;
      margin: 0 auto;
      background: white;
    }
    
    .header {
      border-bottom: 4px solid #FFD700;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    
    .logo-section {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;
    }
    
    .logo {
      width: 50px;
      height: 50px;
      background: #001F3F;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFD700;
      font-weight: bold;
      font-size: 24px;
    }
    
    .header-text h1 {
      color: #001F3F;
      font-size: 28px;
      margin-bottom: 5px;
    }
    
    .header-text p {
      color: #666;
      font-size: 12px;
    }
    
    .state-banner {
      background: linear-gradient(to right, #001F3F, #003366);
      color: white;
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 30px;
      text-align: center;
    }
    
    .state-banner h2 {
      font-size: 24px;
      margin-bottom: 5px;
    }
    
    .state-banner p {
      font-size: 12px;
      opacity: 0.9;
    }
    
    .readiness-section {
      margin-bottom: 30px;
    }
    
    .readiness-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin: 20px 0;
    }
    
    .readiness-card {
      border: 2px solid #001F3F;
      border-radius: 5px;
      padding: 15px;
      text-align: center;
    }
    
    .readiness-card.ready {
      border-color: #10b981;
      background: rgba(16, 185, 129, 0.05);
    }
    
    .readiness-card.not-ready {
      border-color: #ef4444;
      background: rgba(239, 68, 68, 0.05);
    }
    
    .readiness-card h3 {
      color: #001F3F;
      font-size: 12px;
      text-transform: uppercase;
      margin-bottom: 10px;
      letter-spacing: 0.5px;
    }
    
    .readiness-percentage {
      font-size: 36px;
      font-weight: bold;
      color: #FFD700;
      margin-bottom: 5px;
    }
    
    .readiness-status {
      font-size: 12px;
      font-weight: bold;
      padding: 5px 10px;
      border-radius: 3px;
      display: inline-block;
    }
    
    .status-ready {
      background: #10b981;
      color: white;
    }
    
    .status-not-ready {
      background: #ef4444;
      color: white;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    
    table thead {
      background: #001F3F;
      color: white;
    }
    
    table th {
      padding: 12px;
      text-align: left;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #FFD700;
    }
    
    table td {
      padding: 12px;
      border-bottom: 1px solid #ddd;
      font-size: 11px;
    }
    
    table tr:nth-child(even) {
      background: #f9f9f9;
    }
    
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 3px;
      font-size: 10px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    
    .badge-completed {
      background: #10b981;
      color: white;
    }
    
    .badge-in-progress {
      background: #3b82f6;
      color: white;
    }
    
    .badge-overdue {
      background: #ef4444;
      color: white;
    }
    
    .badge-pending {
      background: #f59e0b;
      color: white;
    }
    
    .section-title {
      color: #001F3F;
      font-size: 16px;
      font-weight: bold;
      margin-top: 30px;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 3px solid #FFD700;
    }
    
    .gap-list, .recommendation-list {
      margin-left: 20px;
      margin-bottom: 20px;
    }
    
    .gap-list li, .recommendation-list li {
      margin-bottom: 8px;
      font-size: 11px;
    }
    
    .gap-list li:before {
      content: "⚠ ";
      color: #ef4444;
      font-weight: bold;
      margin-right: 5px;
    }
    
    .recommendation-list li:before {
      content: "→ ";
      color: #FFD700;
      font-weight: bold;
      margin-right: 5px;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #ddd;
      text-align: center;
      font-size: 10px;
      color: #666;
    }
    
    .print-meta {
      font-size: 10px;
      color: #999;
      margin-top: 20px;
    }
    
    @page {
      size: letter;
      margin: 0.5in;
    }
    
    @media print {
      body {
        background: white;
      }
      .page {
        page-break-after: always;
        padding: 30px;
        margin: 0;
      }
    }
  </style>
</head>
<body>
  <!-- Page 1: Cover & Summary -->
  <div class="page">
    <div class="header">
      <div class="logo-section">
        <div class="logo">GV</div>
        <div class="header-text">
          <h1>GovVeritas Lite</h1>
          <p>HOPE-GOV Compliance Readiness Platform</p>
          <p>World Bank Performance for Results (PforR) Programme</p>
        </div>
      </div>
    </div>
    
    <div class="state-banner">
      <h2>${state} State</h2>
      <p>IVA Readiness Assessment Report</p>
      <p>Generated: ${new Date().toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}</p>
    </div>
    
    <div class="readiness-section">
      <h3 class="section-title">Overall Readiness Assessment</h3>
      
      <div class="readiness-grid">
        <div class="readiness-card ${verification.ivaReady ? 'ready' : 'not-ready'}">
          <h3>Readiness Score</h3>
          <div class="readiness-percentage">${verification.overallReadiness}%</div>
          <div class="readiness-status ${
            verification.ivaReady ? 'status-ready' : 'status-not-ready'
          }">
            ${verification.ivaReady ? '✓ Ready for IVA' : '⚠ Not Ready'}
          </div>
        </div>
        
        <div class="readiness-card">
          <h3>Assessment Details</h3>
          <div style="text-align: left; font-size: 11px; margin-top: 10px;">
            <p><strong>State:</strong> ${state}</p>
            <p><strong>DLIs Assessed:</strong> ${dlis.length}</p>
            <p><strong>Assessment Date:</strong> ${new Date().toLocaleDateString('en-NG')}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="readiness-section">
      <h3 class="section-title">Readiness Score Breakdown</h3>
      
      <table>
        <tr>
          <td><strong>Metric</strong></td>
          <td><strong>Score</strong></td>
        </tr>
        <tr>
          <td>Deadlines Met</td>
          <td><strong>${Math.round(verification.scores.deadlinesMet)}%</strong></td>
        </tr>
        <tr>
          <td>Documents Uploaded</td>
          <td><strong>${Math.round(verification.scores.documentsUploaded)}%</strong></td>
        </tr>
        <tr>
          <td>Document Quality</td>
          <td><strong>${Math.round(verification.scores.qualityScore)}%</strong></td>
        </tr>
        <tr>
          <td>Timeline Compliance</td>
          <td><strong>${Math.round(verification.scores.timelineCompliance)}%</strong></td>
        </tr>
      </table>
    </div>
    
    <div class="footer">
      <p>Confidential - For Official Use Only</p>
      <p>Document prepared for World Bank IVA Assessment</p>
    </div>
  </div>
  
  <!-- Page 2: DLI Status -->
  <div class="page">
    <div class="header">
      <div class="logo-section">
        <div class="logo">GV</div>
        <div class="header-text">
          <h1>DLI Status Report</h1>
          <p>${state} State - Disbursement Linked Indicators</p>
        </div>
      </div>
    </div>
    
    <h3 class="section-title">All DLIs - Status & Timeline</h3>
    
    <table>
      <thead>
        <tr>
          <th>DLI Code</th>
          <th>DLI Name</th>
          <th>Status</th>
          <th>Deadline</th>
          <th>Days to Deadline</th>
        </tr>
      </thead>
      <tbody>
        ${dlis.map(dli => {
          const today = new Date();
          const deadline = new Date(dli.deadline);
          const daysUntil = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
          
          let statusClass = 'badge-completed';
          let statusText = 'Completed';
          
          if (daysUntil < 0) {
            statusClass = 'badge-overdue';
            statusText = 'Overdue';
          } else if (daysUntil <= 7) {
            statusClass = 'badge-in-progress';
            statusText = 'Due Soon';
          }
          
          return `
            <tr>
              <td><strong>${dli.code}</strong></td>
              <td>${dli.name}</td>
              <td><span class="badge ${statusClass}">${statusText}</span></td>
              <td>${deadline.toLocaleDateString('en-NG')}</td>
              <td>${daysUntil > 0 ? daysUntil + ' days' : 'Overdue'}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
    
    <div class="footer">
      <p>GovVeritas Lite - Compliance Readiness Platform</p>
      <p>Powered by Optegra Solutions</p>
    </div>
  </div>
  
  <!-- Page 3: Gaps & Recommendations -->
  <div class="page">
    <div class="header">
      <div class="logo-section">
        <div class="logo">GV</div>
        <div class="header-text">
          <h1>Gaps & Action Items</h1>
          <p>${state} State - Remediation Plan</p>
        </div>
      </div>
    </div>
    
    <h3 class="section-title">Identified Gaps</h3>
    ${verification.gaps.length > 0 ? `
      <ul class="gap-list">
        ${verification.gaps.map(gap => `<li>${gap}</li>`).join('')}
      </ul>
    ` : `
      <p style="color: #10b981; font-weight: bold;">✓ No critical gaps identified. State is ready for IVA assessment.</p>
    `}
    
    <h3 class="section-title">Recommended Actions</h3>
    <ul class="recommendation-list">
      ${verification.recommendations.map(rec => `<li>${rec}</li>`).join('')}
    </ul>
    
    <h3 class="section-title">Next Steps</h3>
    <ol style="margin-left: 20px; font-size: 11px;">
      <li style="margin-bottom: 8px;">Review all identified gaps with state team</li>
      <li style="margin-bottom: 8px;">Address critical items within the next 7 days</li>
      <li style="margin-bottom: 8px;">Upload supporting documentation to GovVeritas</li>
      <li style="margin-bottom: 8px;">Monitor DLI progress on dashboard daily</li>
      <li style="margin-bottom: 8px;">Prepare for IVA verification visit</li>
    </ol>
    
    <div class="print-meta">
      <p><strong>Report Generated:</strong> ${new Date().toLocaleString('en-NG')}</p>
      <p><strong>State:</strong> ${state}</p>
      <p><strong>Readiness Score:</strong> ${verification.overallReadiness}%</p>
      <p><strong>IVA Ready:</strong> ${verification.ivaReady ? 'Yes' : 'No'}</p>
    </div>
    
    <div class="footer">
      <p>GovVeritas Lite - Compliance Readiness Platform</p>
      <p>This document is confidential and intended for official use only</p>
      <p>For queries: support@govveritas.gov.ng</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Trigger PDF Download
   */
  static downloadPDF(state, dlis, verification) {
    const htmlContent = this.generateIVAReport(state, dlis, verification);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GovVeritas_${state}_IVA_Report_${new Date().toISOString().split('T')[0]}.html`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

// PDF Export Button Component
export function PDFExportButton({ state, dlis, verification }) {
  const handleExport = () => {
    if (typeof window !== 'undefined') {
      PDFReportGenerator.downloadPDF(state, dlis, verification);
    }
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-6 py-3 bg-[#FFD700] hover:bg-yellow-500 text-[#001F3F] font-bold rounded-lg transition-colors"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
      </svg>
      Export IVA Report (PDF)
    </button>
  );
}
