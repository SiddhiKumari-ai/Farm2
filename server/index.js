import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import db, { initDatabase, seedInitialData } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'farmsetu-super-secret-key-2026-innovation';
const PORT = process.env.PORT || 5000;

// Initialize database
initDatabase();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Auth middleware
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session token' });
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access forbidden: unauthorized role permissions' });
    }
    next();
  };
}

// -------------------------------------------------------------
// AUTH ROUTES
// -------------------------------------------------------------

// Farmer Registration
app.post('/api/auth/register-farmer', (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      state,
      district,
      village,
      pincode,
      farmArea,
      areaUnit,
      primaryActivity,
      currentCrop,
      previousCrop,
      irrigationSource,
      farmingPractices,
      soilReportAvailable
    } = req.body;

    if (!fullName || !email || !phone || !password || !state || !district || !village || !farmArea || !primaryActivity) {
      return res.status(400).json({ error: 'Please provide all mandatory registration fields.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email address already exists. Please login instead.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const userId = crypto.randomUUID();
    const profileId = 'fp-' + crypto.randomBytes(4).toString('hex');
    const now = new Date().toISOString();

    // Insert user
    db.prepare(`
      INSERT INTO users (id, email, password_hash, role, name, phone, created_at, is_demo)
      VALUES (?, ?, ?, 'farmer', ?, ?, ?, 0)
    `).run(userId, normalizedEmail, passwordHash, fullName.trim(), phone.trim(), now);

    // Insert farmer profile
    db.prepare(`
      INSERT INTO farmer_profiles (
        id, user_id, full_name, phone, country, state, district, village, pincode,
        farm_area, area_unit, primary_activity, current_crop, previous_crop,
        irrigation_source, farming_practices, soil_report_available, profile_status, updated_at, is_demo
      ) VALUES (?, ?, ?, ?, 'India', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Profile Submitted', ?, 0)
    `).run(
      profileId,
      userId,
      fullName.trim(),
      phone.trim(),
      state.trim(),
      district.trim(),
      village.trim(),
      pincode ? pincode.trim() : null,
      parseFloat(farmArea),
      areaUnit || 'acres',
      primaryActivity.trim(),
      currentCrop ? currentCrop.trim() : null,
      previousCrop ? previousCrop.trim() : null,
      irrigationSource ? irrigationSource.trim() : null,
      farmingPractices ? farmingPractices.trim() : null,
      soilReportAvailable ? 1 : 0,
      now
    );

    // If farmer has marked soil report available or wanted assessment, we also create initial assessment request
    const sarId = 'SAR-2026-' + Math.floor(1000 + Math.random() * 9000);
    db.prepare(`
      INSERT INTO soil_assessment_requests (
        id, user_id, farmer_name, farm_location, farm_area, soil_type,
        existing_report_filename, notes, status, created_at, updated_at, is_demo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Submitted', ?, ?, 0)
    `).run(
      sarId,
      userId,
      fullName.trim(),
      `${village.trim()}, ${district.trim()}, ${state.trim()}`,
      `${farmArea} ${areaUnit || 'acres'}`,
      'Sandy Loam / Alluvial (Self-reported)',
      soilReportAvailable ? 'initial_onboarding_report.pdf' : null,
      'Initial onboarding farm assessment request. Baseline soil health & carbon suitability review.',
      now,
      now
    );

    const token = jwt.sign({ id: userId, email: normalizedEmail, role: 'farmer', name: fullName.trim() }, JWT_SECRET, { expiresIn: '7d' });

    const userRecord = { id: userId, email: normalizedEmail, role: 'farmer', name: fullName.trim(), phone: phone.trim() };
    const profileRecord = db.prepare('SELECT * FROM farmer_profiles WHERE user_id = ?').get(userId);

    return res.status(201).json({
      message: 'Farmer account registered successfully',
      token,
      user: userRecord,
      profile: profileRecord
    });
  } catch (err) {
    console.error('Error registering farmer:', err);
    return res.status(500).json({ error: 'Server error during farmer registration: ' + err.message });
  }
});

// Company Registration
app.post('/api/auth/register-company', (req, res) => {
  try {
    const {
      companyName,
      contactPerson,
      businessEmail,
      phone,
      companyType,
      password,
      website,
      state,
      district,
      areaOfInterest
    } = req.body;

    if (!companyName || !contactPerson || !businessEmail || !phone || !companyType || !password) {
      return res.status(400).json({ error: 'Please fill in all required company fields.' });
    }

    const normalizedEmail = businessEmail.trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const userId = crypto.randomUUID();
    const profileId = 'cp-' + crypto.randomBytes(4).toString('hex');
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, email, password_hash, role, name, phone, created_at, is_demo)
      VALUES (?, ?, ?, 'company', ?, ?, ?, 0)
    `).run(userId, normalizedEmail, passwordHash, contactPerson.trim(), phone.trim(), now);

    db.prepare(`
      INSERT INTO company_profiles (
        id, user_id, company_name, contact_person, business_email, phone,
        company_type, website, state, district, area_of_interest, updated_at, is_demo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `).run(
      profileId,
      userId,
      companyName.trim(),
      contactPerson.trim(),
      normalizedEmail,
      phone.trim(),
      companyType.trim(),
      website ? website.trim() : null,
      state ? state.trim() : null,
      district ? district.trim() : null,
      areaOfInterest ? areaOfInterest.trim() : null,
      now
    );

    const token = jwt.sign({ id: userId, email: normalizedEmail, role: 'company', name: contactPerson.trim() }, JWT_SECRET, { expiresIn: '7d' });

    const userRecord = { id: userId, email: normalizedEmail, role: 'company', name: contactPerson.trim(), phone: phone.trim() };
    const profileRecord = db.prepare('SELECT * FROM company_profiles WHERE user_id = ?').get(userId);

    return res.status(201).json({
      message: 'Company account created successfully',
      token,
      user: userRecord,
      profile: profileRecord
    });
  } catch (err) {
    console.error('Error registering company:', err);
    return res.status(500).json({ error: 'Server error during company registration: ' + err.message });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password credentials.' });
    }

    const match = bcrypt.compareSync(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password credentials.' });
    }

    let profile = null;
    if (user.role === 'farmer') {
      profile = db.prepare('SELECT * FROM farmer_profiles WHERE user_id = ?').get(user.id);
    } else if (user.role === 'company') {
      profile = db.prepare('SELECT * FROM company_profiles WHERE user_id = ?').get(user.id);
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      message: 'Logged in successfully',
      token,
      user: { id: user.id, email: user.email, role: user.role, name: user.name, phone: user.phone },
      profile
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login error: ' + err.message });
  }
});

// Get current user session
app.get('/api/auth/me', authenticate, (req, res) => {
  try {
    const user = db.prepare('SELECT id, email, role, name, phone, created_at, is_demo FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User account not found' });
    }

    let profile = null;
    if (user.role === 'farmer') {
      profile = db.prepare('SELECT * FROM farmer_profiles WHERE user_id = ?').get(user.id);
    } else if (user.role === 'company') {
      profile = db.prepare('SELECT * FROM company_profiles WHERE user_id = ?').get(user.id);
    }

    return res.json({ user, profile });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Demo Login for rapid judging evaluation
app.post('/api/auth/demo-login', (req, res) => {
  try {
    const { role, index } = req.body;
    let targetEmail = 'admin@farmsetu.in';

    if (role === 'farmer') {
      targetEmail = index === 1 ? 'sunita.devi@demo.farmsetu.in' : 'rameshwar.farmer@demo.farmsetu.in';
    } else if (role === 'company') {
      targetEmail = index === 1 ? 'esg@greenhorizon.example.com' : 'procurement@ecoroots.example.com';
    } else if (role === 'admin') {
      targetEmail = 'admin@farmsetu.in';
    } else {
      return res.status(400).json({ error: 'Invalid demo role selected' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(targetEmail);
    if (!user) {
      return res.status(404).json({ error: 'Demo account not found. Please re-seed demo data.' });
    }

    let profile = null;
    if (user.role === 'farmer') {
      profile = db.prepare('SELECT * FROM farmer_profiles WHERE user_id = ?').get(user.id);
    } else if (user.role === 'company') {
      profile = db.prepare('SELECT * FROM company_profiles WHERE user_id = ?').get(user.id);
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      message: `Demo logged in as ${user.name} (${user.role})`,
      token,
      user: { id: user.id, email: user.email, role: user.role, name: user.name, phone: user.phone },
      profile
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// FARMER ROUTES
// -------------------------------------------------------------

// Get own profile
app.get('/api/farmer/profile', authenticate, requireRole('farmer', 'admin'), (req, res) => {
  try {
    const profile = db.prepare('SELECT * FROM farmer_profiles WHERE user_id = ?').get(req.user.id);
    return res.json(profile || {});
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Update own profile
app.put('/api/farmer/profile', authenticate, requireRole('farmer', 'admin'), (req, res) => {
  try {
    const {
      farmArea,
      areaUnit,
      village,
      district,
      state,
      pincode,
      primaryActivity,
      currentCrop,
      previousCrop,
      irrigationSource,
      farmingPractices,
      soilReportAvailable
    } = req.body;

    const now = new Date().toISOString();

    db.prepare(`
      UPDATE farmer_profiles
      SET farm_area = COALESCE(?, farm_area),
          area_unit = COALESCE(?, area_unit),
          village = COALESCE(?, village),
          district = COALESCE(?, district),
          state = COALESCE(?, state),
          pincode = COALESCE(?, pincode),
          primary_activity = COALESCE(?, primary_activity),
          current_crop = COALESCE(?, current_crop),
          previous_crop = COALESCE(?, previous_crop),
          irrigation_source = COALESCE(?, irrigation_source),
          farming_practices = COALESCE(?, farming_practices),
          soil_report_available = COALESCE(?, soil_report_available),
          updated_at = ?
      WHERE user_id = ?
    `).run(
      farmArea !== undefined ? parseFloat(farmArea) : null,
      areaUnit || null,
      village || null,
      district || null,
      state || null,
      pincode || null,
      primaryActivity || null,
      currentCrop || null,
      previousCrop || null,
      irrigationSource || null,
      farmingPractices || null,
      soilReportAvailable !== undefined ? (soilReportAvailable ? 1 : 0) : null,
      now,
      req.user.id
    );

    const updated = db.prepare('SELECT * FROM farmer_profiles WHERE user_id = ?').get(req.user.id);
    return res.json({ message: 'Farm profile updated successfully', profile: updated });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get farmer assessments
app.get('/api/farmer/assessments', authenticate, requireRole('farmer', 'admin'), (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM soil_assessment_requests WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Submit new soil assessment request
app.post('/api/farmer/assessments', authenticate, requireRole('farmer', 'admin'), (req, res) => {
  try {
    const { soilType, notes, existingReportFilename } = req.body;
    const profile = db.prepare('SELECT * FROM farmer_profiles WHERE user_id = ?').get(req.user.id);

    const sarId = 'SAR-2026-' + Math.floor(1000 + Math.random() * 9000);
    const now = new Date().toISOString();
    const farmLoc = profile ? `${profile.village}, ${profile.district}, ${profile.state}` : 'Location on record';
    const farmArea = profile ? `${profile.farm_area} ${profile.area_unit}` : 'On record';

    db.prepare(`
      INSERT INTO soil_assessment_requests (
        id, user_id, farmer_name, farm_location, farm_area, soil_type,
        existing_report_filename, notes, status, created_at, updated_at, is_demo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Submitted', ?, ?, 0)
    `).run(
      sarId,
      req.user.id,
      req.user.name,
      farmLoc,
      farmArea,
      soilType || 'Soil Type to be analyzed',
      existingReportFilename || null,
      notes || 'Farmer submitted soil testing and carbon-potential evaluation request.',
      now,
      now
    );

    const record = db.prepare('SELECT * FROM soil_assessment_requests WHERE id = ?').get(sarId);
    return res.status(201).json({ message: 'Soil assessment request submitted successfully', request: record });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get farmer equipment requests
app.get('/api/farmer/equipment', authenticate, requireRole('farmer', 'admin'), (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM equipment_requests WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Submit equipment support request
app.post('/api/farmer/equipment', authenticate, requireRole('farmer', 'admin'), (req, res) => {
  try {
    const { equipmentCategory, intendedPractice, requiredPeriod, additionalDetails, farmLocation, farmArea } = req.body;
    if (!equipmentCategory || !intendedPractice || !requiredPeriod) {
      return res.status(400).json({ error: 'Equipment category, intended practice, and required period are mandatory.' });
    }

    const profile = db.prepare('SELECT * FROM farmer_profiles WHERE user_id = ?').get(req.user.id);
    const eqrId = 'EQR-2026-' + Math.floor(1000 + Math.random() * 9000);
    const now = new Date().toISOString();
    const loc = farmLocation || (profile ? `${profile.village}, ${profile.district}, ${profile.state}` : 'On file');
    const area = farmArea || (profile ? `${profile.farm_area} ${profile.area_unit}` : 'On file');

    db.prepare(`
      INSERT INTO equipment_requests (
        id, user_id, farmer_name, equipment_category, intended_practice, farm_location,
        farm_area, required_period, additional_details, status, created_at, updated_at, is_demo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Requested', ?, ?, 0)
    `).run(
      eqrId,
      req.user.id,
      req.user.name,
      equipmentCategory,
      intendedPractice,
      loc,
      area,
      requiredPeriod,
      additionalDetails || null,
      now,
      now
    );

    const record = db.prepare('SELECT * FROM equipment_requests WHERE id = ?').get(eqrId);
    return res.status(201).json({ message: 'Equipment support request registered successfully', request: record });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get farmer carbon programme projects & timeline
app.get('/api/farmer/programmes', authenticate, requireRole('farmer', 'admin'), (req, res) => {
  try {
    const projects = db.prepare('SELECT * FROM carbon_programme_projects WHERE farmer_id = ? ORDER BY created_at DESC').all(req.user.id);

    const enriched = projects.map(p => {
      const history = db.prepare('SELECT * FROM project_stage_history WHERE project_id = ? ORDER BY timestamp ASC').all(p.id);
      return { ...p, history };
    });

    return res.json(enriched);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// COMPANY ROUTES
// -------------------------------------------------------------

// Get company profile
app.get('/api/company/profile', authenticate, requireRole('company', 'admin'), (req, res) => {
  try {
    const profile = db.prepare('SELECT * FROM company_profiles WHERE user_id = ?').get(req.user.id);
    return res.json(profile || {});
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Update company profile
app.put('/api/company/profile', authenticate, requireRole('company', 'admin'), (req, res) => {
  try {
    const { companyName, contactPerson, phone, companyType, website, state, district, areaOfInterest } = req.body;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE company_profiles
      SET company_name = COALESCE(?, company_name),
          contact_person = COALESCE(?, contact_person),
          phone = COALESCE(?, phone),
          company_type = COALESCE(?, company_type),
          website = COALESCE(?, website),
          state = COALESCE(?, state),
          district = COALESCE(?, district),
          area_of_interest = COALESCE(?, area_of_interest),
          updated_at = ?
      WHERE user_id = ?
    `).run(
      companyName || null,
      contactPerson || null,
      phone || null,
      companyType || null,
      website || null,
      state || null,
      district || null,
      areaOfInterest || null,
      now,
      req.user.id
    );

    const updated = db.prepare('SELECT * FROM company_profiles WHERE user_id = ?').get(req.user.id);
    return res.json({ message: 'Company profile updated', profile: updated });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get company inquiries
app.get('/api/company/inquiries', authenticate, requireRole('company', 'admin'), (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM buyer_inquiries WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Submit company buyer requirement inquiry
app.post('/api/company/inquiries', authenticate, requireRole('company', 'admin'), (req, res) => {
  try {
    const {
      projectType,
      preferredRegion,
      requiredCharacteristics,
      requestedQuantity,
      indicativeTimeline,
      additionalRequirements,
      phone
    } = req.body;

    if (!projectType || !preferredRegion || !requiredCharacteristics) {
      return res.status(400).json({ error: 'Project type, preferred region, and required characteristics are mandatory.' });
    }

    const companyProfile = db.prepare('SELECT * FROM company_profiles WHERE user_id = ?').get(req.user.id);
    const inqId = 'INQ-2026-' + Math.floor(1000 + Math.random() * 9000);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO buyer_inquiries (
        id, user_id, company_name, contact_person, business_email, phone,
        project_type, preferred_region, required_characteristics, requested_quantity,
        indicative_timeline, additional_requirements, status, created_at, updated_at, is_demo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Submitted', ?, ?, 0)
    `).run(
      inqId,
      req.user.id,
      companyProfile ? companyProfile.company_name : req.user.name,
      req.user.name,
      req.user.email,
      phone || (companyProfile ? companyProfile.phone : ''),
      projectType,
      preferredRegion,
      requiredCharacteristics,
      requestedQuantity || null,
      indicativeTimeline || null,
      additionalRequirements || null,
      now,
      now
    );

    const created = db.prepare('SELECT * FROM buyer_inquiries WHERE id = ?').get(inqId);
    return res.status(201).json({ message: 'Buyer requirement inquiry submitted successfully', inquiry: created });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// ADMIN DASHBOARD ROUTES (Protected: Admin Only)
// -------------------------------------------------------------

// Overview summary stats
app.get('/api/admin/stats', authenticate, requireRole('admin'), (req, res) => {
  try {
    const totalFarmers = db.prepare('SELECT COUNT(*) as count FROM farmer_profiles').get().count;
    const realFarmers = db.prepare('SELECT COUNT(*) as count FROM farmer_profiles WHERE is_demo = 0').get().count;
    const sampleFarmers = db.prepare('SELECT COUNT(*) as count FROM farmer_profiles WHERE is_demo = 1').get().count;

    const totalCompanies = db.prepare('SELECT COUNT(*) as count FROM company_profiles').get().count;
    const realCompanies = db.prepare('SELECT COUNT(*) as count FROM company_profiles WHERE is_demo = 0').get().count;

    const pendingAssessments = db.prepare("SELECT COUNT(*) as count FROM soil_assessment_requests WHERE status IN ('Submitted', 'Under Review', 'Expert Review Required')").get().count;
    const openEquipmentRequests = db.prepare("SELECT COUNT(*) as count FROM equipment_requests WHERE status IN ('Requested', 'Reviewing', 'Partner Search')").get().count;
    const buyerInquiries = db.prepare('SELECT COUNT(*) as count FROM buyer_inquiries').get().count;
    const activeProgrammes = db.prepare("SELECT COUNT(*) as count FROM carbon_programme_projects WHERE stage != 'Registration'").get().count;

    const recentActivity = [
      ...db.prepare("SELECT id, full_name as title, 'farmer_registered' as type, updated_at as created_at, is_demo FROM farmer_profiles ORDER BY updated_at DESC LIMIT 4").all(),
      ...db.prepare("SELECT id, equipment_category as title, 'equipment_request' as type, created_at, is_demo FROM equipment_requests ORDER BY created_at DESC LIMIT 3").all(),
      ...db.prepare("SELECT id, company_name as title, 'buyer_inquiry' as type, created_at, is_demo FROM buyer_inquiries ORDER BY created_at DESC LIMIT 3").all()
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 8);

    return res.json({
      totalFarmers,
      realFarmers,
      sampleFarmers,
      totalCompanies,
      realCompanies,
      pendingAssessments,
      openEquipmentRequests,
      buyerInquiries,
      activeProgrammes,
      recentActivity
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// List all farmers
app.get('/api/admin/farmers', authenticate, requireRole('admin'), (req, res) => {
  try {
    const farmers = db.prepare(`
      SELECT fp.*, u.email, u.name, u.created_at as registered_on
      FROM farmer_profiles fp
      JOIN users u ON fp.user_id = u.id
      ORDER BY fp.updated_at DESC
    `).all();
    return res.json(farmers);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Farmer details
app.get('/api/admin/farmers/:id', authenticate, requireRole('admin'), (req, res) => {
  try {
    const farmer = db.prepare(`
      SELECT fp.*, u.email, u.created_at as registered_on
      FROM farmer_profiles fp
      JOIN users u ON fp.user_id = u.id
      WHERE fp.id = ? OR fp.user_id = ?
    `).get(req.params.id, req.params.id);

    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }

    const assessments = db.prepare('SELECT * FROM soil_assessment_requests WHERE user_id = ? ORDER BY created_at DESC').all(farmer.user_id);
    const equipment = db.prepare('SELECT * FROM equipment_requests WHERE user_id = ? ORDER BY created_at DESC').all(farmer.user_id);
    const programmes = db.prepare('SELECT * FROM carbon_programme_projects WHERE farmer_id = ? ORDER BY created_at DESC').all(farmer.user_id);

    return res.json({ farmer, assessments, equipment, programmes });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Update farmer profile review status
app.put('/api/admin/farmers/:id/status', authenticate, requireRole('admin'), (req, res) => {
  try {
    const { status } = req.body;
    const now = new Date().toISOString();
    db.prepare('UPDATE farmer_profiles SET profile_status = ?, updated_at = ? WHERE id = ? OR user_id = ?').run(status, now, req.params.id, req.params.id);
    return res.json({ message: 'Farmer status updated', status });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// List all companies
app.get('/api/admin/companies', authenticate, requireRole('admin'), (req, res) => {
  try {
    const companies = db.prepare(`
      SELECT cp.*, u.created_at as registered_on
      FROM company_profiles cp
      JOIN users u ON cp.user_id = u.id
      ORDER BY cp.updated_at DESC
    `).all();
    return res.json(companies);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// List all soil assessments
app.get('/api/admin/assessments', authenticate, requireRole('admin'), (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM soil_assessment_requests ORDER BY created_at DESC').all();
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Update soil assessment (status, assigned expert, notes, expert recommendations)
app.put('/api/admin/assessments/:id', authenticate, requireRole('admin'), (req, res) => {
  try {
    const { status, assignedExpert, adminNotes, farmerVisibleNotes, expertRecommendations } = req.body;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE soil_assessment_requests
      SET status = COALESCE(?, status),
          assigned_expert = COALESCE(?, assigned_expert),
          admin_notes = COALESCE(?, admin_notes),
          farmer_visible_notes = COALESCE(?, farmer_visible_notes),
          expert_recommendations = COALESCE(?, expert_recommendations),
          updated_at = ?
      WHERE id = ?
    `).run(
      status || null,
      assignedExpert || null,
      adminNotes !== undefined ? adminNotes : null,
      farmerVisibleNotes !== undefined ? farmerVisibleNotes : null,
      expertRecommendations !== undefined ? expertRecommendations : null,
      now,
      req.params.id
    );

    const updated = db.prepare('SELECT * FROM soil_assessment_requests WHERE id = ?').get(req.params.id);
    return res.json({ message: 'Soil assessment request updated successfully', assessment: updated });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// List all equipment requests
app.get('/api/admin/equipment', authenticate, requireRole('admin'), (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM equipment_requests ORDER BY created_at DESC').all();
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Update equipment request
app.put('/api/admin/equipment/:id', authenticate, requireRole('admin'), (req, res) => {
  try {
    const { status, adminNotes, farmerVisibleNotes } = req.body;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE equipment_requests
      SET status = COALESCE(?, status),
          admin_notes = COALESCE(?, admin_notes),
          farmer_visible_notes = COALESCE(?, farmer_visible_notes),
          updated_at = ?
      WHERE id = ?
    `).run(
      status || null,
      adminNotes !== undefined ? adminNotes : null,
      farmerVisibleNotes !== undefined ? farmerVisibleNotes : null,
      now,
      req.params.id
    );

    const updated = db.prepare('SELECT * FROM equipment_requests WHERE id = ?').get(req.params.id);
    return res.json({ message: 'Equipment request updated', request: updated });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// List all buyer inquiries
app.get('/api/admin/inquiries', authenticate, requireRole('admin'), (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM buyer_inquiries ORDER BY created_at DESC').all();
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Update buyer inquiry
app.put('/api/admin/inquiries/:id', authenticate, requireRole('admin'), (req, res) => {
  try {
    const { status, internalNotes, companyVisibleNotes, potentialMatches } = req.body;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE buyer_inquiries
      SET status = COALESCE(?, status),
          internal_notes = COALESCE(?, internal_notes),
          company_visible_notes = COALESCE(?, company_visible_notes),
          potential_matches = COALESCE(?, potential_matches),
          updated_at = ?
      WHERE id = ?
    `).run(
      status || null,
      internalNotes !== undefined ? internalNotes : null,
      companyVisibleNotes !== undefined ? companyVisibleNotes : null,
      potentialMatches !== undefined ? potentialMatches : null,
      now,
      req.params.id
    );

    const updated = db.prepare('SELECT * FROM buyer_inquiries WHERE id = ?').get(req.params.id);
    return res.json({ message: 'Buyer inquiry updated', inquiry: updated });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// List all carbon programmes
app.get('/api/admin/programmes', authenticate, requireRole('admin'), (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM carbon_programme_projects ORDER BY created_at DESC').all();
    const enriched = list.map(p => {
      const history = db.prepare('SELECT * FROM project_stage_history WHERE project_id = ? ORDER BY timestamp ASC').all(p.id);
      return { ...p, history };
    });
    return res.json(enriched);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Create new carbon programme project
app.post('/api/admin/programmes', authenticate, requireRole('admin'), (req, res) => {
  try {
    const { projectName, farmerId, location, practiceType, targetAcres, stage, projectPartner, statusNotes } = req.body;

    if (!projectName || !farmerId) {
      return res.status(400).json({ error: 'Project name and linked farmer are required' });
    }

    const farmer = db.prepare('SELECT * FROM farmer_profiles WHERE user_id = ? OR id = ?').get(farmerId, farmerId);
    if (!farmer) {
      return res.status(404).json({ error: 'Farmer profile not found' });
    }

    const projId = 'CP-2026-' + Math.floor(1000 + Math.random() * 9000);
    const now = new Date().toISOString();
    const currentStage = stage || 'Registration';

    db.prepare(`
      INSERT INTO carbon_programme_projects (
        id, project_name, farmer_id, farmer_name, location, practice_type,
        target_acres, stage, project_partner, status_notes, updated_by_admin, created_at, updated_at, is_demo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `).run(
      projId,
      projectName.trim(),
      farmer.user_id,
      farmer.full_name,
      location || `${farmer.village}, ${farmer.district}, ${farmer.state}`,
      practiceType || 'Sustainable Practice Transition',
      targetAcres ? parseFloat(targetAcres) : farmer.farm_area,
      currentStage,
      projectPartner || 'FarmSetu Agronomy Network',
      statusNotes || 'Initial programme coordination record created.',
      req.user.name,
      now,
      now
    );

    // Initial stage history entry
    db.prepare(`
      INSERT INTO project_stage_history (id, project_id, stage, notes, updated_by, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(crypto.randomUUID(), projId, currentStage, statusNotes || 'Project initiated by Admin.', req.user.name, now);

    const created = db.prepare('SELECT * FROM carbon_programme_projects WHERE id = ?').get(projId);
    return res.status(201).json({ message: 'Carbon programme project created', project: created });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Update project stage
app.put('/api/admin/programmes/:id/stage', authenticate, requireRole('admin'), (req, res) => {
  try {
    const { stage, notes, creditsConfirmedAmount, projectPartner } = req.body;
    if (!stage) {
      return res.status(400).json({ error: 'Stage is required' });
    }

    const now = new Date().toISOString();
    const issuanceDate = stage === 'Credits Issued' ? now : null;

    db.prepare(`
      UPDATE carbon_programme_projects
      SET stage = ?,
          status_notes = COALESCE(?, status_notes),
          credits_confirmed_amount = COALESCE(?, credits_confirmed_amount),
          issuance_date = COALESCE(?, issuance_date),
          project_partner = COALESCE(?, project_partner),
          updated_by_admin = ?,
          updated_at = ?
      WHERE id = ?
    `).run(
      stage,
      notes || null,
      creditsConfirmedAmount !== undefined ? parseFloat(creditsConfirmedAmount) : null,
      issuanceDate,
      projectPartner || null,
      req.user.name,
      now,
      req.params.id
    );

    // Insert history
    db.prepare(`
      INSERT INTO project_stage_history (id, project_id, stage, notes, updated_by, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(crypto.randomUUID(), req.params.id, stage, notes || `Stage updated to ${stage}`, req.user.name, now);

    const updated = db.prepare('SELECT * FROM carbon_programme_projects WHERE id = ?').get(req.params.id);
    const history = db.prepare('SELECT * FROM project_stage_history WHERE project_id = ? ORDER BY timestamp ASC').all(req.params.id);

    return res.json({ message: `Project stage updated to ${stage}`, project: { ...updated, history } });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// List contact submissions
app.get('/api/admin/contacts', authenticate, requireRole('admin'), (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM contact_submissions ORDER BY created_at DESC').all();
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Reset demo data safely
app.post('/api/admin/reset-demo-data', authenticate, requireRole('admin'), (req, res) => {
  try {
    seedInitialData(true);
    return res.json({ message: 'Demo data has been safely refreshed without affecting real submissions.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// PUBLIC ROUTES
// -------------------------------------------------------------

// Submit contact form
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const id = 'cnt-' + crypto.randomBytes(4).toString('hex');
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO contact_submissions (id, name, email, phone, subject, message, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'New', ?)
    `).run(id, name.trim(), email.trim(), phone ? phone.trim() : null, subject ? subject.trim() : 'Inquiry', message.trim(), now);

    return res.status(201).json({ message: 'Your message has been received by the FarmSetu coordination desk. We will get back to you shortly.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Public impact stats
app.get('/api/stats/public', (req, res) => {
  try {
    const farmersCount = db.prepare('SELECT COUNT(*) as count FROM farmer_profiles').get().count;
    const acresCount = db.prepare('SELECT SUM(farm_area) as total FROM farmer_profiles').get().total || 0;
    const projectsCount = db.prepare('SELECT COUNT(*) as count FROM carbon_programme_projects').get().count;
    const equipmentCount = db.prepare('SELECT COUNT(*) as count FROM equipment_requests').get().count;

    return res.json({
      registeredFarmers: farmersCount,
      coordinatedAcres: Math.round(acresCount * 10) / 10,
      activeProgrammes: projectsCount,
      equipmentRequests: equipmentCount
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Serve static production frontend if client/dist exists
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, '../client/dist');

if (fs.existsSync(clientDistPath)) {
  console.log('Serving production static frontend from', clientDistPath);
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`FarmSetu API server running on http://localhost:${PORT}`);
});

