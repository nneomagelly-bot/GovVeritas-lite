// backend/server.js
// GovVeritas Lite v2.0 - Express.js Server

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ====================================
// CONFIGURATION
// ====================================

const app = express();
const PORT = process.env.PORT || 3001;

// Database Connection Pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'govveritas_lite',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_change_in_production';

// ====================================
// MIDDLEWARE
// ====================================

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('combined'));

// Request logging
app.use((req, res, next) => {
  req.startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

// ====================================
// AUTHENTICATION MIDDLEWARE
// ====================================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ====================================
// UTILITY FUNCTIONS
// ====================================

// Calculate readiness score for DLR/EC
async function calculateReadinessScore(stateId, dlrId = null, ecId = null) {
  try {
    let query = `
      SELECT 
        smp.status,
        smp.actual_completion_date,
        m.due_date,
        COUNT(ed.id)::float as document_count,
        AVG(ed.quality_score)::float as avg_quality
      FROM state_milestone_progress smp
      JOIN milestones m ON smp.milestone_id = m.id
      LEFT JOIN evidence_documents ed ON ed.state_id = smp.state_id 
        AND ed.milestone_id = smp.milestone_id
      WHERE smp.state_id = $1
    `;

    const params = [stateId];

    if (dlrId) {
      query += ` AND m.dlr_id = $2`;
      params.push(dlrId);
    } else if (ecId) {
      query += ` AND m.ec_id = $2`;
      params.push(ecId);
    }

    query += ` GROUP BY smp.status, smp.actual_completion_date, m.due_date`;

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return 0;
    }

    let totalScore = 0;
    let milestoneCount = 0;
    let qualityScore = 0;

    result.rows.forEach(row => {
      let stageScore = 0;

      if (row.status === 'complete') {
        stageScore = 1.0;
        const actualDate = new Date(row.actual_completion_date);
        const dueDate = new Date(row.due_date);
        const daysDiff = (actualDate - dueDate) / (1000 * 60 * 60 * 24);

        // Apply bonus/penalty
        if (daysDiff < 0) {
          stageScore = Math.min(1.1, 1.0 + (Math.abs(daysDiff) * 0.01));
        } else if (daysDiff > 0) {
          stageScore = Math.max(0.7, 1.0 - (daysDiff * 0.05));
        }
      } else if (row.status === 'in_progress') {
        stageScore = 0.5;
        const now = new Date();
        const dueDate = new Date(row.due_date);
        const daysBehind = (now - dueDate) / (1000 * 60 * 60 * 24);

        if (daysBehind > 0) {
          stageScore = Math.max(0.2, 0.5 - (daysBehind * 0.05));
        }
      }

      totalScore += stageScore;
      milestoneCount++;

      if (row.avg_quality) {
        qualityScore += row.avg_quality;
      }
    });

    const milestoneAverage = milestoneCount > 0 ? totalScore / milestoneCount : 0;
    const avgQuality = result.rows.length > 0 
      ? qualityScore / result.rows.filter(r => r.avg_quality).length 
      : 0;

    const overallScore = (milestoneAverage * 0.7) + (avgQuality * 0.3);
    return Math.round(overallScore * 100);
  } catch (error) {
    console.error('Error calculating readiness:', error);
    return 0;
  }
}

// ====================================
// AUTH ENDPOINTS
// ====================================

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Get state information
    const stateResult = await pool.query(
      'SELECT * FROM states WHERE id = $1',
      [user.state_id]
    );

    const state = stateResult.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        state_id: user.state_id,
        state_name: state.state_name,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Update last login
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        state_name: state.state_name,
        state_id: user.state_id
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// ====================================
// DASHBOARD ENDPOINTS
// ====================================

app.get('/api/dashboard/readiness', authenticateToken, async (req, res) => {
  try {
    const { state_id } = req.user;

    // Get all ECs and their readiness
    const ecsResult = await pool.query(`
      SELECT id, ec_code, ec_name FROM eligibility_criteria ORDER BY ec_code
    `);

    // Get all DLRs and their readiness
    const dlrsResult = await pool.query(`
      SELECT id, dlr_code, dlr_name FROM disbursement_linked_results ORDER BY dlr_code
    `);

    let ecReadiness = [];
    let dlrReadiness = [];
    let totalReadiness = 0;

    // Calculate readiness for each EC
    for (const ec of ecsResult.rows) {
      const score = await calculateReadinessScore(state_id, null, ec.id);
      ecReadiness.push({
        ec_code: ec.ec_code,
        ec_name: ec.ec_name,
        readiness_percentage: score,
        status: score === 100 ? 'complete' : score >= 85 ? 'near_complete' : score >= 60 ? 'in_progress' : 'at_risk'
      });
    }

    // Calculate readiness for each DLR
    for (const dlr of dlrsResult.rows) {
      const score = await calculateReadinessScore(state_id, dlr.id, null);
      dlrReadiness.push({
        dlr_code: dlr.dlr_code,
        dlr_name: dlr.dlr_name,
        readiness_percentage: score,
        status: score === 100 ? 'complete' : score >= 85 ? 'good' : score >= 60 ? 'progressing' : 'at_risk'
      });
    }

    // Calculate overall readiness
    const allScores = [...ecReadiness.map(e => e.readiness_percentage), ...dlrReadiness.map(d => d.readiness_percentage)];
    totalReadiness = allScores.length > 0 
      ? Math.round(allScores.reduce((a, b) => a + b) / allScores.length) 
      : 0;

    // Get alerts
    const alertsResult = await pool.query(`
      SELECT 
        CASE 
          WHEN m.due_date < CURRENT_DATE AND smp.status != 'complete' THEN 'critical'
          WHEN m.due_date < CURRENT_DATE + INTERVAL '7 days' AND smp.status != 'complete' THEN 'medium'
          ELSE 'low'
        END as severity,
        dlr.dlr_code,
        dlr.dlr_name,
        m.stage_name,
        m.due_date,
        smp.status
      FROM state_milestone_progress smp
      JOIN milestones m ON smp.milestone_id = m.id
      LEFT JOIN disbursement_linked_results dlr ON m.dlr_id = dlr.id
      LEFT JOIN eligibility_criteria ec ON m.ec_id = ec.id
      WHERE smp.state_id = $1 
        AND smp.status != 'complete'
        AND (dlr.id IS NOT NULL OR ec.id IS NOT NULL)
      ORDER BY m.due_date ASC
      LIMIT 5
    `, [state_id]);

    const alerts = alertsResult.rows.map(alert => ({
      severity: alert.severity,
      title: `${alert.dlr_code || 'EC'}: ${alert.dlr_name || 'Due'} - ${alert.stage_name}`,
      due_date: alert.due_date,
      days_remaining: Math.ceil((new Date(alert.due_date) - new Date()) / (1000 * 60 * 60 * 24))
    }));

    res.json({
      overall_readiness_percentage: totalReadiness,
      eligibility_criteria: ecReadiness,
      disbursement_linked_results: dlrReadiness,
      alerts: alerts,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard data' });
  }
});

// ====================================
// DLR DETAIL ENDPOINTS
// ====================================

app.get('/api/dlr/:dlr_id/detail', authenticateToken, async (req, res) => {
  try {
    const { dlr_id } = req.params;
    const { state_id } = req.user;

    // Get DLR info
    const dlrResult = await pool.query(
      'SELECT * FROM disbursement_linked_results WHERE id = $1',
      [dlr_id]
    );

    if (dlrResult.rows.length === 0) {
      return res.status(404).json({ error: 'DLR not found' });
    }

    const dlr = dlrResult.rows[0];

    // Get milestones
    const milestonesResult = await pool.query(`
      SELECT m.*, smp.status, smp.actual_completion_date, smp.notes
      FROM milestones m
      LEFT JOIN state_milestone_progress smp ON m.id = smp.milestone_id 
        AND smp.state_id = $1
      WHERE m.dlr_id = $2
      ORDER BY m.stage_number ASC
    `, [state_id, dlr_id]);

    // Get documents
    const docsResult = await pool.query(
      'SELECT * FROM evidence_documents WHERE state_id = $1 AND dlr_id = $2 ORDER BY upload_date DESC',
      [state_id, dlr_id]
    );

    // Calculate readiness
    const readinessScore = await calculateReadinessScore(state_id, dlr_id, null);

    // Format response
    const milestones = milestonesResult.rows.map(m => ({
      stage_number: m.stage_number,
      stage_name: m.stage_name,
      due_date: m.due_date,
      status: m.status || 'not_started',
      actual_completion_date: m.actual_completion_date,
      notes: m.notes
    }));

    const documents = docsResult.rows.map(d => ({
      id: d.id,
      name: d.document_name,
      type: d.document_type,
      upload_date: d.upload_date,
      status: d.document_status,
      quality_score: d.quality_score,
      url: d.s3_url
    }));

    res.json({
      dlr_id: dlr.id,
      dlr_code: dlr.dlr_code,
      dlr_name: dlr.dlr_name,
      final_deadline: dlr.final_deadline,
      overall_readiness_percentage: readinessScore,
      milestones: milestones,
      documents: documents,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('DLR detail error:', error);
    res.status(500).json({ error: 'Failed to get DLR details' });
  }
});

// ====================================
// DOCUMENT UPLOAD ENDPOINT
// ====================================

app.post('/api/documents/upload', authenticateToken, async (req, res) => {
  try {
    const { dlr_id, milestone_id, file_base64, filename, narrative_summary } = req.body;
    const { state_id } = req.user;

    // For now, save file metadata (in production, upload to S3)
    const docId = require('crypto').randomUUID();
    const s3_key = `documents/${state_id}/${dlr_id}/${docId}`;
    const s3_url = `https://s3.amazonaws.com/govveritas/${s3_key}`;

    const result = await pool.query(`
      INSERT INTO evidence_documents 
      (id, state_id, dlr_id, milestone_id, document_name, document_type, 
       s3_key, s3_url, upload_date, uploaded_by_email, narrative_summary, 
       document_status, virus_scan_status, quality_score)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, $9, $10, 
              'pending_review', 'clean', 0.85)
      RETURNING *
    `, [
      docId,
      state_id,
      dlr_id,
      milestone_id,
      filename,
      filename.split('.').pop(),
      s3_key,
      s3_url,
      req.user.email,
      narrative_summary
    ]);

    // Update milestone progress if document uploaded
    if (milestone_id) {
      await pool.query(`
        UPDATE state_milestone_progress 
        SET status = 'in_progress', updated_at = CURRENT_TIMESTAMP
        WHERE state_id = $1 AND milestone_id = $2
      `, [state_id, milestone_id]);
    }

    res.json({
      document_id: docId,
      document_name: filename,
      status: 'pending_review',
      virus_scan_status: 'clean',
      upload_date: new Date().toISOString(),
      message: 'Document uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Document upload failed' });
  }
});

// ====================================
// MOCK VERIFICATION ENDPOINT
// ====================================

app.get('/api/mock-verification/:dlr_id', authenticateToken, async (req, res) => {
  try {
    const { dlr_id } = req.params;
    const { state_id } = req.user;

    const readinessScore = await calculateReadinessScore(state_id, dlr_id, null);

    // Get documents for this DLR
    const docsResult = await pool.query(
      'SELECT COUNT(*) as count FROM evidence_documents WHERE state_id = $1 AND dlr_id = $2 AND document_status = $3',
      [state_id, dlr_id, 'verified']
    );

    const docCount = parseInt(docsResult.rows[0].count);

    // Get milestones
    const milestonesResult = await pool.query(`
      SELECT COUNT(*) as count FROM milestones WHERE dlr_id = $1
    `, [dlr_id]);

    const milestoneCount = parseInt(milestonesResult.rows[0].count);

    // Calculate gaps
    const gaps = readinessScore < 100 
      ? ['Missing documents', 'Quality issues', 'Timeline delays'] 
      : [];

    res.json({
      dlr_id: dlr_id,
      assessment_date: new Date().toISOString(),
      overall_score: readinessScore,
      document_completeness: Math.round((docCount / milestoneCount) * 100),
      quality_score: 85,
      timing_score: readinessScore > 80 ? 'good' : 'needs_improvement',
      iva_readiness: `${readinessScore}% (${100 - readinessScore} days to 100%)`,
      gaps: gaps,
      recommendations: readinessScore < 100 
        ? ['Upload missing documents', 'Complete pending stages', 'Accelerate timeline']
        : ['All systems ready', 'Maintain current progress']
    });
  } catch (error) {
    console.error('Mock verification error:', error);
    res.status(500).json({ error: 'Failed to run mock verification' });
  }
});

// ====================================
// HEALTH CHECK
// ====================================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ====================================
// START SERVER
// ====================================

app.listen(PORT, () => {
  console.log(`GovVeritas Lite API Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});

module.exports = { app, pool };
