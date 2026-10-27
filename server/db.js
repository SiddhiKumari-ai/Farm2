import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'farmsetu.db');
const db = new DatabaseSync(dbPath);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

export function initDatabase() {
  console.log('Initializing FarmSetu SQLite database schema...');

  // 1. Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('farmer', 'company', 'admin')),
      name TEXT NOT NULL,
      phone TEXT,
      created_at TEXT NOT NULL,
      is_demo INTEGER DEFAULT 0
    );
  `);

  // 2. Farmer profiles
  db.exec(`
    CREATE TABLE IF NOT EXISTS farmer_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT,
      country TEXT DEFAULT 'India',
      state TEXT NOT NULL,
      district TEXT NOT NULL,
      village TEXT NOT NULL,
      pincode TEXT,
      farm_area REAL NOT NULL,
      area_unit TEXT NOT NULL DEFAULT 'acres',
      primary_activity TEXT NOT NULL,
      current_crop TEXT,
      previous_crop TEXT,
      irrigation_source TEXT,
      farming_practices TEXT,
      soil_report_available INTEGER DEFAULT 0,
      profile_status TEXT DEFAULT 'Profile Submitted',
      updated_at TEXT NOT NULL,
      is_demo INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 3. Company profiles
  db.exec(`
    CREATE TABLE IF NOT EXISTS company_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      company_name TEXT NOT NULL,
      contact_person TEXT NOT NULL,
      business_email TEXT NOT NULL,
      phone TEXT,
      company_type TEXT NOT NULL,
      website TEXT,
      state TEXT,
      district TEXT,
      area_of_interest TEXT,
      updated_at TEXT NOT NULL,
      is_demo INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 4. Soil assessment requests
  db.exec(`
    CREATE TABLE IF NOT EXISTS soil_assessment_requests (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      farmer_name TEXT NOT NULL,
      farm_location TEXT NOT NULL,
      farm_area TEXT NOT NULL,
      soil_type TEXT,
      existing_report_filename TEXT,
      notes TEXT,
      status TEXT DEFAULT 'Submitted' CHECK(status IN ('Submitted', 'Under Review', 'Expert Review Required', 'Reviewed')),
      assigned_expert TEXT,
      admin_notes TEXT,
      farmer_visible_notes TEXT,
      expert_recommendations TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      is_demo INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 5. Equipment requests
  db.exec(`
    CREATE TABLE IF NOT EXISTS equipment_requests (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      farmer_name TEXT NOT NULL,
      equipment_category TEXT NOT NULL,
      intended_practice TEXT NOT NULL,
      farm_location TEXT NOT NULL,
      farm_area TEXT NOT NULL,
      required_period TEXT NOT NULL,
      additional_details TEXT,
      status TEXT DEFAULT 'Requested' CHECK(status IN ('Requested', 'Reviewing', 'Partner Search', 'Arranged', 'Unavailable')),
      admin_notes TEXT,
      farmer_visible_notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      is_demo INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 6. Buyer inquiries
  db.exec(`
    CREATE TABLE IF NOT EXISTS buyer_inquiries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      company_name TEXT NOT NULL,
      contact_person TEXT NOT NULL,
      business_email TEXT NOT NULL,
      phone TEXT,
      project_type TEXT NOT NULL,
      preferred_region TEXT NOT NULL,
      required_characteristics TEXT NOT NULL,
      requested_quantity TEXT,
      indicative_timeline TEXT,
      additional_requirements TEXT,
      status TEXT DEFAULT 'Submitted' CHECK(status IN ('Submitted', 'Under Review', 'More Information Required', 'Potential Match Under Review', 'Closed')),
      internal_notes TEXT,
      company_visible_notes TEXT,
      potential_matches TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      is_demo INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 7. Carbon programme projects
  db.exec(`
    CREATE TABLE IF NOT EXISTS carbon_programme_projects (
      id TEXT PRIMARY KEY,
      project_name TEXT NOT NULL,
      farmer_id TEXT NOT NULL,
      farmer_name TEXT NOT NULL,
      location TEXT NOT NULL,
      practice_type TEXT NOT NULL,
      target_acres REAL,
      stage TEXT DEFAULT 'Registration' CHECK(stage IN (
        'Registration',
        'Farm Information Submitted',
        'Preliminary Assessment',
        'Eligibility Review',
        'Programme/Partner Coordination',
        'Practice Adoption and Training',
        'Monitoring',
        'Verification Pending',
        'Credits Issued'
      )),
      linked_inquiry_id TEXT,
      project_partner TEXT,
      status_notes TEXT,
      credits_confirmed_amount REAL DEFAULT 0,
      issuance_date TEXT,
      updated_by_admin TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      is_demo INTEGER DEFAULT 0,
      FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 8. Project stage history
  db.exec(`
    CREATE TABLE IF NOT EXISTS project_stage_history (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      stage TEXT NOT NULL,
      notes TEXT,
      updated_by TEXT,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (project_id) REFERENCES carbon_programme_projects(id) ON DELETE CASCADE
    );
  `);

  // 9. Contact submissions
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'New',
      created_at TEXT NOT NULL
    );
  `);

  // Seed sample data if admin doesn't exist
  seedInitialData();
}

export function seedInitialData(force = false) {
  const checkAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@farmsetu.in');
  if (checkAdmin && !force) {
    return;
  }

  if (force) {
    console.log('Resetting demo data...');
    // Delete only records marked as is_demo = 1
    db.exec(`DELETE FROM project_stage_history WHERE project_id IN (SELECT id FROM carbon_programme_projects WHERE is_demo = 1);`);
    db.exec(`DELETE FROM carbon_programme_projects WHERE is_demo = 1;`);
    db.exec(`DELETE FROM buyer_inquiries WHERE is_demo = 1;`);
    db.exec(`DELETE FROM equipment_requests WHERE is_demo = 1;`);
    db.exec(`DELETE FROM soil_assessment_requests WHERE is_demo = 1;`);
    db.exec(`DELETE FROM company_profiles WHERE is_demo = 1;`);
    db.exec(`DELETE FROM farmer_profiles WHERE is_demo = 1;`);
    db.exec(`DELETE FROM users WHERE is_demo = 1;`);
  }

  console.log('Seeding initial FarmSetu accounts and demo records...');
  const salt = bcrypt.genSaltSync(10);
  const adminPassHash = bcrypt.hashSync('Admin@FarmSetu2026!', salt);
  const farmerPassHash = bcrypt.hashSync('Farmer@123', salt);
  const companyPassHash = bcrypt.hashSync('Company@123', salt);

  const now = new Date().toISOString();

  // 1. Admin user
  const adminId = 'admin-user-001';
  db.prepare(`
    INSERT OR REPLACE INTO users (id, email, password_hash, role, name, phone, created_at, is_demo)
    VALUES (?, ?, ?, ?, ?, ?, ?, 0)
  `).run(adminId, 'admin@farmsetu.in', adminPassHash, 'admin', 'FarmSetu Central Operations Admin', '+91 98765 43210', now);

  // 2. Demo Farmer: Rameshwar Patel (Ramgarh, Jharkhand)
  const farmer1Id = 'demo-farmer-001';
  db.prepare(`
    INSERT OR REPLACE INTO users (id, email, password_hash, role, name, phone, created_at, is_demo)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `).run(farmer1Id, 'rameshwar.farmer@demo.farmsetu.in', farmerPassHash, 'farmer', 'Rameshwar Patel', '+91 94311 02938', now);

  db.prepare(`
    INSERT OR REPLACE INTO farmer_profiles (
      id, user_id, full_name, phone, country, state, district, village, pincode,
      farm_area, area_unit, primary_activity, current_crop, previous_crop,
      irrigation_source, farming_practices, soil_report_available, profile_status, updated_at, is_demo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `).run(
    'fp-001',
    farmer1Id,
    'Rameshwar Patel',
    '+91 94311 02938',
    'India',
    'Jharkhand',
    'Ramgarh',
    'Gola Block, Barlanga',
    '829110',
    4.5,
    'acres',
    'Grain & Cereal Cultivation',
    'Paddy (Rice - MTU 1010)',
    'Wheat & Mustard',
    'Borewell & Canal Tributary',
    'Conventional Tillage with organic FYM application',
    1,
    'Verified Profile',
    now
  );

  // Demo Farmer 2: Sunita Devi (Hazaribagh, Jharkhand)
  const farmer2Id = 'demo-farmer-002';
  db.prepare(`
    INSERT OR REPLACE INTO users (id, email, password_hash, role, name, phone, created_at, is_demo)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `).run(farmer2Id, 'sunita.devi@demo.farmsetu.in', farmerPassHash, 'farmer', 'Sunita Devi', '+91 98213 44556', now);

  db.prepare(`
    INSERT OR REPLACE INTO farmer_profiles (
      id, user_id, full_name, phone, country, state, district, village, pincode,
      farm_area, area_unit, primary_activity, current_crop, previous_crop,
      irrigation_source, farming_practices, soil_report_available, profile_status, updated_at, is_demo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `).run(
    'fp-002',
    farmer2Id,
    'Sunita Devi',
    '+91 98213 44556',
    'India',
    'Jharkhand',
    'Hazaribagh',
    'Barkagaon, Harli',
    '825311',
    2.8,
    'acres',
    'Millets, Pulses & Horticulture',
    'Finger Millet (Ragi) & Pigeon Pea',
    'Maize',
    'Farm Pond & Micro-Drip',
    'Natural Farming / Zero Synthetic Chemicals',
    0,
    'Profile Submitted',
    now
  );

  // 3. Demo Company: EcoRoots AgriVentures
  const company1Id = 'demo-company-001';
  db.prepare(`
    INSERT OR REPLACE INTO users (id, email, password_hash, role, name, phone, created_at, is_demo)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `).run(company1Id, 'procurement@ecoroots.example.com', companyPassHash, 'company', 'Vikramaditya Rao', '+91 99001 88223', now);

  db.prepare(`
    INSERT OR REPLACE INTO company_profiles (
      id, user_id, company_name, contact_person, business_email, phone,
      company_type, website, state, district, area_of_interest, updated_at, is_demo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `).run(
    'cp-001',
    company1Id,
    'EcoRoots AgriVentures Pvt Ltd',
    'Vikramaditya Rao (Head of Carbon Solutions)',
    'procurement@ecoroots.example.com',
    '+91 99001 88223',
    'Sustainability Solution Provider & Corporate Aggregator',
    'https://ecoroots-agriventures.example.com',
    'Maharashtra',
    'Mumbai Suburban',
    'Soil Organic Carbon (SOC) sequestration & reduced residue burning programs across Eastern & Northern India',
    now
  );

  // Demo Company 2: GreenHorizon Climate Fund
  const company2Id = 'demo-company-002';
  db.prepare(`
    INSERT OR REPLACE INTO users (id, email, password_hash, role, name, phone, created_at, is_demo)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `).run(company2Id, 'esg@greenhorizon.example.com', companyPassHash, 'company', 'Dr. Ananya Sharma', '+91 98110 55443', now);

  db.prepare(`
    INSERT OR REPLACE INTO company_profiles (
      id, user_id, company_name, contact_person, business_email, phone,
      company_type, website, state, district, area_of_interest, updated_at, is_demo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `).run(
    'cp-002',
    company2Id,
    'GreenHorizon Climate Impact Fund',
    'Dr. Ananya Sharma',
    'esg@greenhorizon.example.com',
    '+91 98110 55443',
    'Institutional ESG Buyer / Impact Fund',
    'https://greenhorizon-impact.example.com',
    'Karnataka',
    'Bengaluru Urban',
    'High-integrity Verified Carbon Standard (VCS) agricultural carbon credits with direct farmer benefit sharing',
    now
  );

  // 4. Sample Soil Assessment Requests
  db.prepare(`
    INSERT OR REPLACE INTO soil_assessment_requests (
      id, user_id, farmer_name, farm_location, farm_area, soil_type,
      existing_report_filename, notes, status, assigned_expert, admin_notes, farmer_visible_notes, expert_recommendations,
      created_at, updated_at, is_demo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `).run(
    'SAR-2026-001',
    farmer1Id,
    'Rameshwar Patel',
    'Gola Block, Ramgarh, Jharkhand',
    '4.5 acres',
    'Red Sandy Loam',
    'soil_sample_ramgarh_01.pdf',
    'Want assessment for carbon-farming eligibility and soil organic carbon baseline.',
    'Reviewed',
    'Dr. K. S. Murthy (ICAR-KVK Agronomist)',
    'Verified lab test parameters: pH 6.4, OC 0.44% (marginal). Recommended green manure cover crop before Kharif.',
    'Your soil organic carbon baseline is 0.44%. Transitioning to reduced tillage and Sesbania green manuring will accelerate carbon buildup and enhance nitrogen retention.',
    '1. Practice: Summer cover cropping with Dhaincha (Sesbania bispinosa).\n2. Crop Suggestion: Short-duration legume intercrop (Moong bean / Urad) to enhance root nodulation.\n3. Carbon Potential: High carbon accumulation capacity in Sandy Loam with reduced tillage.',
    now,
    now
  );

  db.prepare(`
    INSERT OR REPLACE INTO soil_assessment_requests (
      id, user_id, farmer_name, farm_location, farm_area, soil_type,
      existing_report_filename, notes, status, assigned_expert, admin_notes, farmer_visible_notes, expert_recommendations,
      created_at, updated_at, is_demo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `).run(
    'SAR-2026-002',
    farmer2Id,
    'Sunita Devi',
    'Barkagaon, Hazaribagh, Jharkhand',
    '2.8 acres',
    'Lateritic Sandy Clay',
    null,
    'Requesting field visit and soil core test for organic millet plot.',
    'Under Review',
    'District KVK Agro-Scientist Assigned',
    'Field sampling scheduled for next week with local FPO coordinator.',
    'Your assessment request has been assigned to the District KVK Soil Specialist. The field assistant will contact you for sample collection.',
    null,
    now,
    now
  );

  // 5. Sample Equipment Requests
  db.prepare(`
    INSERT OR REPLACE INTO equipment_requests (
      id, user_id, farmer_name, equipment_category, intended_practice, farm_location,
      farm_area, required_period, additional_details, status, admin_notes, farmer_visible_notes, created_at, updated_at, is_demo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `).run(
    'EQR-2026-001',
    farmer1Id,
    'Rameshwar Patel',
    'Zero-till / Reduced Tillage Seed Drill',
    'Direct Seeded Rice (DSR) & Zero-till Wheat sowing to avoid residue burning',
    'Ramgarh, Jharkhand',
    '4.5 acres',
    'Next Rabi Season (Nov 15 - Nov 30)',
    'Need compatible tractor-mounted Happy Seeder / DSR drill with tractor operator.',
    'Partner Search',
    'Contacting Custom Hiring Center (CHC) in Ramgarh Industrial Area and local FPO machinery bank.',
    'We are currently coordinating with nearby Custom Hiring Centers (CHC) and FPOs to arrange a verified zero-till seed drill for your scheduled dates.',
    now,
    now
  );

  db.prepare(`
    INSERT OR REPLACE INTO equipment_requests (
      id, user_id, farmer_name, equipment_category, intended_practice, farm_location,
      farm_area, required_period, additional_details, status, admin_notes, farmer_visible_notes, created_at, updated_at, is_demo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `).run(
    'EQR-2026-002',
    farmer2Id,
    'Sunita Devi',
    'Irrigation & Moisture Retention',
    'Micro-Drip and Mulch Laying for vegetable and millet intercropping',
    'Barkagaon, Hazaribagh',
    '2.8 acres',
    'Immediate (Pre-monsoon preparation)',
    'Require portable solar-pump compatible micro-sprinkler or drip kit.',
    'Reviewing',
    'Checking state horticulture subsidy and partner equipment distributor.',
    'Our technical team is reviewing your farm elevation and water pump specifications to match suitable drip equipment.',
    now,
    now
  );

  // 6. Sample Buyer Inquiries
  db.prepare(`
    INSERT OR REPLACE INTO buyer_inquiries (
      id, user_id, company_name, contact_person, business_email, phone,
      project_type, preferred_region, required_characteristics, requested_quantity,
      indicative_timeline, additional_requirements, status, internal_notes, company_visible_notes, potential_matches, created_at, updated_at, is_demo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `).run(
    'INQ-2026-001',
    company1Id,
    'EcoRoots AgriVentures Pvt Ltd',
    'Vikramaditya Rao',
    'procurement@ecoroots.example.com',
    '+91 99001 88223',
    'Soil Organic Carbon (SOC) Sequestration',
    'Jharkhand, Bihar & Eastern UP',
    'Smallholder farmer aggregation (1-5 acres), verified baseline soil testing, digital MRV tracking',
    '5,000 tCO2e (indicative)',
    'Q3 2026 - Q2 2027',
    'Must comply with Verra VM0042 methodology or Gold Standard Soil Carbon frameworks. Direct benefit transfer to farmer bank accounts required.',
    'Potential Match Under Review',
    'Matches pilot cluster of 45 smallholders in Ramgarh & Hazaribagh. Preliminary aggregate area: 180 acres.',
    'Your requirement has been mapped to our Eastern India smallholder cluster. Initial feasibility assessment shows high practice compatibility (DSR + Organic FYM).',
    'Cluster JH-01 (Ramgarh Smallholders - 45 Farmers)',
    now,
    now
  );

  db.prepare(`
    INSERT OR REPLACE INTO buyer_inquiries (
      id, user_id, company_name, contact_person, business_email, phone,
      project_type, preferred_region, required_characteristics, requested_quantity,
      indicative_timeline, additional_requirements, status, internal_notes, company_visible_notes, potential_matches, created_at, updated_at, is_demo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `).run(
    'INQ-2026-002',
    company2Id,
    'GreenHorizon Climate Impact Fund',
    'Dr. Ananya Sharma',
    'esg@greenhorizon.example.com',
    '+91 98110 55443',
    'Residue Management & Biochar',
    'Punjab, Haryana & Western UP',
    'Zero-stubble burning paddy fields, straw baling or biochar in-situ soil incorporation',
    '10,000 tCO2e',
    '2026-2027 Crop Cycles',
    'Auditable satellite monitoring confirmation for zero crop residue burning events.',
    'Under Review',
    'Assessing partner FPO equipment capacity for Happy Seeder deployment.',
    'Requirement under active review by FarmSetu North Zone agronomy coordination cell.',
    null,
    now,
    now
  );

  // 7. Sample Carbon Programme Project
  const proj1Id = 'CP-2026-001';
  db.prepare(`
    INSERT OR REPLACE INTO carbon_programme_projects (
      id, project_name, farmer_id, farmer_name, location, practice_type,
      target_acres, stage, linked_inquiry_id, project_partner, status_notes,
      credits_confirmed_amount, issuance_date, updated_by_admin, created_at, updated_at, is_demo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `).run(
    proj1Id,
    'Chotanagpur Regenerative Agriculture & Soil Carbon Pilot',
    farmer1Id,
    'Rameshwar Patel',
    'Ramgarh, Jharkhand',
    'Reduced Tillage & Legume Green Manuring',
    4.5,
    'Practice Adoption and Training',
    'INQ-2026-001',
    'ICAR-CRURRS & Ramgarh Organic Farmer Collective',
    'Farmer completed zero-tillage demonstration workshop and received certified Sesbania seeds.',
    0,
    null,
    'FarmSetu Central Operations Admin',
    now,
    now
  );

  // Stage history for Project 1
  const stageRecords = [
    { stage: 'Registration', notes: 'Farmer account created and verified in portal.', time: '2026-03-10T09:00:00Z' },
    { stage: 'Farm Information Submitted', notes: 'Detailed plot boundaries and crop history uploaded.', time: '2026-03-15T11:30:00Z' },
    { stage: 'Preliminary Assessment', notes: 'Initial soil baseline score 0.44% OC documented.', time: '2026-04-02T14:15:00Z' },
    { stage: 'Eligibility Review', notes: 'Meets criteria under regenerative paddy-wheat rotation protocol.', time: '2026-04-18T10:00:00Z' },
    { stage: 'Programme/Partner Coordination', notes: 'Enrolled in Chotanagpur Pilot cohort; linked to technical agronomist.', time: '2026-05-05T16:45:00Z' },
    { stage: 'Practice Adoption and Training', notes: 'Completed hands-on seed drill training; sowing with green manure begun.', time: now }
  ];

  for (const s of stageRecords) {
    db.prepare(`
      INSERT OR REPLACE INTO project_stage_history (id, project_id, stage, notes, updated_by, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(crypto.randomUUID(), proj1Id, s.stage, s.notes, 'Central Operations Admin', s.time);
  }

  // Sample Project 2 for Farmer 2 (Sunita Devi)
  const proj2Id = 'CP-2026-002';
  db.prepare(`
    INSERT OR REPLACE INTO carbon_programme_projects (
      id, project_name, farmer_id, farmer_name, location, practice_type,
      target_acres, stage, linked_inquiry_id, project_partner, status_notes,
      credits_confirmed_amount, issuance_date, updated_by_admin, created_at, updated_at, is_demo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `).run(
    proj2Id,
    'Hazaribagh Agro-Ecological Millet Carbon Transition',
    farmer2Id,
    'Sunita Devi',
    'Barkagaon, Hazaribagh, Jharkhand',
    'Natural Farming & Organic Mulching',
    2.8,
    'Preliminary Assessment',
    null,
    'District Agriculture Office & KVK Hazaribagh',
    'Soil sample test results awaited from district analytical laboratory.',
    0,
    null,
    'FarmSetu Central Operations Admin',
    now,
    now
  );

  db.prepare(`
    INSERT OR REPLACE INTO project_stage_history (id, project_id, stage, notes, updated_by, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(crypto.randomUUID(), proj2Id, 'Registration', 'Farmer onboarding completed via mobile portal.', 'Central Admin', now);
  db.prepare(`
    INSERT OR REPLACE INTO project_stage_history (id, project_id, stage, notes, updated_by, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(crypto.randomUUID(), proj2Id, 'Farm Information Submitted', 'Plot dimensions: 2.8 acres, millet-focused crop rotation.', 'Central Admin', now);
  db.prepare(`
    INSERT OR REPLACE INTO project_stage_history (id, project_id, stage, notes, updated_by, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(crypto.randomUUID(), proj2Id, 'Preliminary Assessment', 'Assessment initiated; field agronomist visit scheduled.', 'Central Admin', now);

  // Contact submission
  db.prepare(`
    INSERT OR REPLACE INTO contact_submissions (id, name, email, phone, subject, message, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'cnt-001',
    'Amitabh Choudhury',
    'amitabh.c@jharkhandagri.org',
    '+91 94311 88776',
    'FPO Partnership Inquiry',
    'We represent 600 farmers in Ramgarh and wish to explore collective onboarding for carbon credit verification.',
    'New',
    now
  );

  console.log('Sample data seeding completed successfully.');
}

export default db;
