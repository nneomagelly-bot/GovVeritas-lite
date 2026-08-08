-- GovVeritas Lite v2.0 Database Schema
-- PostgreSQL

-- ====================================
-- 1. STATES TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_name VARCHAR(100) UNIQUE NOT NULL,
  state_code VARCHAR(10),
  region VARCHAR(50),
  coordinator_name VARCHAR(100),
  coordinator_email VARCHAR(100),
  coordinator_phone VARCHAR(20),
  reviewer_name VARCHAR(100),
  reviewer_email VARCHAR(100),
  reviewer_phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_states_code ON states(state_code);
CREATE INDEX idx_states_email ON states(coordinator_email);

-- ====================================
-- 2. ELIGIBILITY CRITERIA TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS eligibility_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ec_code VARCHAR(10) NOT NULL UNIQUE,
  ec_name VARCHAR(255) NOT NULL,
  description TEXT,
  final_deadline DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================
-- 3. DISBURSEMENT LINKED RESULTS TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS disbursement_linked_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dlr_code VARCHAR(10) NOT NULL UNIQUE,
  dlr_name VARCHAR(255) NOT NULL,
  description TEXT,
  final_deadline DATE NOT NULL,
  success_criteria TEXT,
  dli_code VARCHAR(10),
  dli_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dlr_code ON disbursement_linked_results(dlr_code);

-- ====================================
-- 4. MILESTONES TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ec_id UUID REFERENCES eligibility_criteria(id) NULL,
  dlr_id UUID REFERENCES disbursement_linked_results(id) NULL,
  stage_number INT NOT NULL,
  stage_name VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  owner_role VARCHAR(100),
  deliverables TEXT ARRAY,
  verification_requirement TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(ec_id, stage_number),
  UNIQUE(dlr_id, stage_number)
);

CREATE INDEX idx_milestones_due_date ON milestones(due_date);
CREATE INDEX idx_milestones_ec ON milestones(ec_id);
CREATE INDEX idx_milestones_dlr ON milestones(dlr_id);

-- ====================================
-- 5. STATE MILESTONE PROGRESS TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS state_milestone_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id UUID REFERENCES states(id) NOT NULL,
  milestone_id UUID REFERENCES milestones(id) NOT NULL,
  status VARCHAR(50) DEFAULT 'not_started',
  expected_completion_date DATE,
  actual_completion_date DATE,
  evidence_document_ids UUID ARRAY DEFAULT '{}',
  notes TEXT,
  submitted_by_email VARCHAR(100),
  submitted_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(state_id, milestone_id)
);

CREATE INDEX idx_milestone_progress_state ON state_milestone_progress(state_id);
CREATE INDEX idx_milestone_progress_status ON state_milestone_progress(status);
CREATE INDEX idx_milestone_progress_updated ON state_milestone_progress(updated_at);

-- ====================================
-- 6. EVIDENCE DOCUMENTS TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS evidence_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id UUID REFERENCES states(id) NOT NULL,
  dlr_id UUID REFERENCES disbursement_linked_results(id),
  ec_id UUID REFERENCES eligibility_criteria(id),
  milestone_id UUID REFERENCES milestones(id),
  document_name VARCHAR(255) NOT NULL,
  document_type VARCHAR(50),
  file_size INT,
  s3_key VARCHAR(255),
  s3_url VARCHAR(500),
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  uploaded_by_email VARCHAR(100),
  narrative_summary TEXT,
  document_status VARCHAR(50) DEFAULT 'pending_review',
  virus_scan_status VARCHAR(50) DEFAULT 'scanning',
  virus_scan_completed_at TIMESTAMP,
  quality_score NUMERIC(3,2),
  quality_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_state ON evidence_documents(state_id);
CREATE INDEX idx_documents_dlr ON evidence_documents(dlr_id);
CREATE INDEX idx_documents_status ON evidence_documents(document_status);

-- ====================================
-- 7. MOCK VERIFICATION RESULTS TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS mock_verification_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id UUID REFERENCES states(id) NOT NULL,
  dlr_id UUID REFERENCES disbursement_linked_results(id),
  ec_id UUID REFERENCES eligibility_criteria(id),
  assessment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  overall_readiness_percentage NUMERIC(3,2),
  document_completeness_percentage NUMERIC(3,2),
  document_quality_score NUMERIC(3,2),
  timing_compliance_score NUMERIC(3,2),
  iva_readiness_score NUMERIC(3,2),
  
  passed BOOLEAN,
  gaps_identified TEXT ARRAY DEFAULT '{}',
  recommendations TEXT ARRAY DEFAULT '{}',
  days_to_readiness INT,
  days_to_final_deadline INT,
  
  assessment_type VARCHAR(50),
  triggered_by_event VARCHAR(100),
  report_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_verification_state ON mock_verification_results(state_id);
CREATE INDEX idx_verification_assessment_date ON mock_verification_results(assessment_date);

-- ====================================
-- 8. STATE READINESS SNAPSHOTS TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS state_readiness_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id UUID REFERENCES states(id) NOT NULL,
  snapshot_date DATE NOT NULL,
  
  overall_readiness_percentage NUMERIC(3,2),
  
  ec1_percentage NUMERIC(3,2),
  ec2_percentage NUMERIC(3,2),
  ec3_percentage NUMERIC(3,2),
  
  dlr_21_percentage NUMERIC(3,2),
  dlr_22_percentage NUMERIC(3,2),
  dlr_23_percentage NUMERIC(3,2),
  dlr_41_percentage NUMERIC(3,2),
  dlr_42_percentage NUMERIC(3,2),
  dlr_51_percentage NUMERIC(3,2),
  dlr_52_percentage NUMERIC(3,2),
  dlr_6_percentage NUMERIC(3,2),
  
  critical_risks_count INT,
  medium_risks_count INT,
  low_risks_count INT,
  
  percentage_change_from_previous NUMERIC(3,2),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(state_id, snapshot_date)
);

CREATE INDEX idx_readiness_snapshot_state ON state_readiness_snapshots(state_id);
CREATE INDEX idx_readiness_snapshot_date ON state_readiness_snapshots(snapshot_date);

-- ====================================
-- 9. MOCK VERIFICATION REPORTS TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS mock_verification_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id UUID REFERENCES states(id) NOT NULL,
  report_date DATE NOT NULL,
  report_type VARCHAR(50),
  
  executive_summary TEXT,
  detailed_findings TEXT,
  risk_assessment TEXT,
  recommendations TEXT,
  priority_actions TEXT ARRAY DEFAULT '{}',
  
  overall_readiness NUMERIC(3,2),
  probability_of_passing_percentage NUMERIC(3,2),
  
  generated_by VARCHAR(50),
  generated_at TIMESTAMP,
  report_format VARCHAR(20),
  report_file_s3_key VARCHAR(255),
  report_file_url VARCHAR(500),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reports_state ON mock_verification_reports(state_id);
CREATE INDEX idx_reports_date ON mock_verification_reports(report_date);

-- ====================================
-- 10. AUDIT LOG TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(100) NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  state_id UUID REFERENCES states(id),
  details JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_state ON audit_logs(state_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- ====================================
-- 11. USERS TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id UUID REFERENCES states(id) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  role VARCHAR(50),
  password_hash VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_state ON users(state_id);
CREATE INDEX idx_users_active ON users(is_active);

-- ====================================
-- SEED DATA
-- ====================================

-- Insert EC-1: Annual State Budget Published
INSERT INTO eligibility_criteria (ec_code, ec_name, description, final_deadline)
VALUES ('EC-1', 'Annual State Budget Approved & Published', 
  'State must approve annual budget via State Assembly and publish online',
  '2025-01-31')
ON CONFLICT (ec_code) DO NOTHING;

-- Insert EC-2: Audited Financial Statements
INSERT INTO eligibility_criteria (ec_code, ec_name, description, final_deadline)
VALUES ('EC-2', 'Audited Financial Statements (IPSAS Standard)', 
  'Submit FY24 audited financial statements in IPSAS format',
  '2025-07-31')
ON CONFLICT (ec_code) DO NOTHING;

-- Insert EC-3: Quarterly Reports
INSERT INTO eligibility_criteria (ec_code, ec_name, description, final_deadline)
VALUES ('EC-3', 'Quarterly Budget Implementation Reports', 
  'Publish quarterly budget implementation reports within 30 days of quarter end',
  NULL)
ON CONFLICT (ec_code) DO NOTHING;

-- Insert DLR 2.1: BED Guidelines
INSERT INTO disbursement_linked_results (dlr_code, dlr_name, description, final_deadline, dli_code, dli_name)
VALUES ('DLR 2.1', 'State Adopts Comprehensive BED Budget Planning Guidelines',
  'State adopts and STC-approves comprehensive budget planning guidelines for Basic Education',
  '2025-03-31', 'DLI 2', 'Strengthened State Budget Planning')
ON CONFLICT (dlr_code) DO NOTHING;

-- Insert DLR 2.2: PHC Guidelines
INSERT INTO disbursement_linked_results (dlr_code, dlr_name, description, final_deadline, dli_code, dli_name)
VALUES ('DLR 2.2', 'State Adopts Comprehensive PHC Budget Planning Guidelines',
  'State adopts and STC-approves comprehensive budget planning guidelines for Primary Healthcare',
  '2025-03-31', 'DLI 2', 'Strengthened State Budget Planning')
ON CONFLICT (dlr_code) DO NOTHING;

-- Insert DLR 2.3: LG Harmonization
INSERT INTO disbursement_linked_results (dlr_code, dlr_name, description, final_deadline, dli_code, dli_name)
VALUES ('DLR 2.3', 'Local Governments Adopt Harmonized Budget Guidelines (80% Adoption)',
  'Minimum 80% of LGs adopt harmonized budget guidelines and Chart of Accounts',
  '2025-01-31', 'DLI 2', 'Strengthened State Budget Planning')
ON CONFLICT (dlr_code) DO NOTHING;

-- Insert DLR 4.1: Citizen Budget
INSERT INTO disbursement_linked_results (dlr_code, dlr_name, description, final_deadline, dli_code, dli_name)
VALUES ('DLR 4.1', 'State Publishes Citizen Budget (BED & PHC)',
  'State publishes accessible citizen budget covering BED and PHC allocations',
  '2025-02-28', 'DLI 4', 'Strengthened Public Financial Management')
ON CONFLICT (dlr_code) DO NOTHING;

-- Insert DLR 4.2: Financial & Performance Audits
INSERT INTO disbursement_linked_results (dlr_code, dlr_name, description, final_deadline, dli_code, dli_name)
VALUES ('DLR 4.2', 'Financial & Performance Audits of BED & PHC Submitted & Published',
  'Submit to State Assembly and publish online financial and performance audits of BED and PHC FY24',
  '2025-06-30', 'DLI 4', 'Strengthened Public Financial Management')
ON CONFLICT (dlr_code) DO NOTHING;

-- Insert DLR 5.1: Teacher Baseline
INSERT INTO disbursement_linked_results (dlr_code, dlr_name, description, final_deadline, dli_code, dli_name)
VALUES ('DLR 5.1', 'Teacher Baseline Mapping & Multi-Year Costed Recruitment Plan',
  'Baseline mapping of teachers by LG and duty station, including multi-year costed recruitment plan',
  '2025-03-31', 'DLI 5', 'Enhanced Human Resources Management')
ON CONFLICT (dlr_code) DO NOTHING;

-- Insert DLR 5.2: Healthcare Worker Baseline
INSERT INTO disbursement_linked_results (dlr_code, dlr_name, description, final_deadline, dli_code, dli_name)
VALUES ('DLR 5.2', 'Healthcare Worker Baseline Mapping & Multi-Year Costed Recruitment Plan',
  'Baseline mapping of healthcare workers by facility, including multi-year costed recruitment plan',
  '2025-03-31', 'DLI 5', 'Enhanced Human Resources Management')
ON CONFLICT (dlr_code) DO NOTHING;

-- Insert DLR 6: Biometric Capture
INSERT INTO disbursement_linked_results (dlr_code, dlr_name, description, final_deadline, dli_code, dli_name)
VALUES ('DLR 6', 'Biometric Capture & BVN Linkage (80% Coverage)',
  'Achieve 80% biometric capture and BVN linkage for BED and PHC workers',
  '2025-12-31', 'DLI 6', 'Worker Biometric Registration')
ON CONFLICT (dlr_code) DO NOTHING;

-- ====================================
-- LOAD MILESTONES FOR EC-1
-- ====================================

DO $$
DECLARE
  ec1_id UUID;
BEGIN
  SELECT id INTO ec1_id FROM eligibility_criteria WHERE ec_code = 'EC-1' LIMIT 1;
  
  -- Stage 1
  INSERT INTO milestones (ec_id, stage_number, stage_name, due_date, owner_role, deliverables, verification_requirement)
  VALUES (ec1_id, 1, 'Budget Call Circular Issued', '2024-12-15', 'Commissioner of Finance',
    ARRAY['Call circular document'], 'Letter/circular issued to MDAs')
  ON CONFLICT DO NOTHING;
  
  -- Stage 2
  INSERT INTO milestones (ec_id, stage_number, stage_name, due_date, owner_role, deliverables, verification_requirement)
  VALUES (ec1_id, 2, 'MDA Budget Submissions', '2024-12-31', 'All Ministries/Departments',
    ARRAY['Budget proposals from all MDAs'], 'Evidence of submissions received')
  ON CONFLICT DO NOTHING;
  
  -- Stage 3
  INSERT INTO milestones (ec_id, stage_number, stage_name, due_date, owner_role, deliverables, verification_requirement)
  VALUES (ec1_id, 3, 'Budget Consolidation & Review', '2025-01-15', 'Commissioner of Finance',
    ARRAY['Consolidated budget document', 'Impact analysis'], 'Signed consolidation memo')
  ON CONFLICT DO NOTHING;
  
  -- Stage 4
  INSERT INTO milestones (ec_id, stage_number, stage_name, due_date, owner_role, deliverables, verification_requirement)
  VALUES (ec1_id, 4, 'State Assembly Approval', '2025-01-25', 'State House of Assembly',
    ARRAY['Approved budget with Assembly stamp'], 'Assembly resolution/approval letter')
  ON CONFLICT DO NOTHING;
  
  -- Stage 5
  INSERT INTO milestones (ec_id, stage_number, stage_name, due_date, owner_role, deliverables, verification_requirement)
  VALUES (ec1_id, 5, 'Online Publication', '2025-01-31', 'Finance Web Team',
    ARRAY['Live URL', 'Publication screenshot'], 'Working URL with publication date')
  ON CONFLICT DO NOTHING;
  
END $$;

-- ====================================
-- LOAD MILESTONES FOR DLR 2.1 (BED Guidelines)
-- ====================================

DO $$
DECLARE
  dlr21_id UUID;
BEGIN
  SELECT id INTO dlr21_id FROM disbursement_linked_results WHERE dlr_code = 'DLR 2.1' LIMIT 1;
  
  INSERT INTO milestones (dlr_id, stage_number, stage_name, due_date, owner_role, deliverables, verification_requirement)
  VALUES (dlr21_id, 1, 'Guidelines Drafted', '2024-12-31', 'Commissioner of Education',
    ARRAY['Guidelines document'], 'Final draft completed and dated')
  ON CONFLICT DO NOTHING;
  
  INSERT INTO milestones (dlr_id, stage_number, stage_name, due_date, owner_role, deliverables, verification_requirement)
  VALUES (dlr21_id, 2, 'Stakeholder Engagement', '2025-01-10', 'State Education Secretariat',
    ARRAY['Stakeholder feedback', 'Engagement minutes'], 'Meeting minutes with stakeholder feedback')
  ON CONFLICT DO NOTHING;
  
  INSERT INTO milestones (dlr_id, stage_number, stage_name, due_date, owner_role, deliverables, verification_requirement)
  VALUES (dlr21_id, 3, 'STC Approval', '2025-01-20', 'State Technical Committee',
    ARRAY['STC approval letter'], 'Signed approval letter from STC')
  ON CONFLICT DO NOTHING;
  
  INSERT INTO milestones (dlr_id, stage_number, stage_name, due_date, owner_role, deliverables, verification_requirement)
  VALUES (dlr21_id, 4, 'Online Publication', '2025-03-31', 'Finance Web Team',
    ARRAY['Live URL', 'Guidelines PDF'], 'Published online with working link')
  ON CONFLICT DO NOTHING;
  
END $$;

-- Load 37 States
INSERT INTO states (state_name, state_code, region)
VALUES 
  ('Abia', 'AB', 'South East'),
  ('Adamawa', 'AD', 'North East'),
  ('Akwa Ibom', 'AK', 'South South'),
  ('Anambra', 'AN', 'South East'),
  ('Bauchi', 'BA', 'North East'),
  ('Bayelsa', 'BY', 'South South'),
  ('Benue', 'BE', 'North Central'),
  ('Borno', 'BO', 'North East'),
  ('Cross River', 'CR', 'South South'),
  ('Delta', 'DE', 'South South'),
  ('Ebonyi', 'EB', 'South East'),
  ('Edo', 'ED', 'South South'),
  ('Ekiti', 'EK', 'South West'),
  ('Enugu', 'EN', 'South East'),
  ('Gombe', 'GO', 'North East'),
  ('Imo', 'IM', 'South East'),
  ('Jigawa', 'JI', 'North West'),
  ('Kaduna', 'KA', 'North Central'),
  ('Kano', 'KN', 'North West'),
  ('Katsina', 'KT', 'North West'),
  ('Kebbi', 'KB', 'North West'),
  ('Kogi', 'KO', 'North Central'),
  ('Kwara', 'KW', 'North Central'),
  ('Lagos', 'LA', 'South West'),
  ('Nasarawa', 'NA', 'North Central'),
  ('Niger', 'NI', 'North Central'),
  ('Ogun', 'OG', 'South West'),
  ('Ondo', 'ON', 'South West'),
  ('Osun', 'OS', 'South West'),
  ('Oyo', 'OY', 'South West'),
  ('Plateau', 'PL', 'North Central'),
  ('Rivers', 'RV', 'South South'),
  ('Sokoto', 'SO', 'North West'),
  ('Taraba', 'TA', 'North East'),
  ('Yobe', 'YB', 'North East'),
  ('Zamfara', 'ZA', 'North West'),
  ('FCT', 'FC', 'North Central')
ON CONFLICT (state_name) DO NOTHING;

-- ====================================
-- VERIFY TABLES CREATED
-- ====================================

SELECT 'Database setup complete!' as status;
