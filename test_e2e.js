// Automated E2E QA Test Script for FarmSetu Platform
const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('========================================================');
  console.log('  STARTING FARMSETU FULL-STACK ACCEPTANCE TESTS');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Public Stats Endpoint
    console.log('--- 1. Testing Public Impact Metrics ---');
    const statsRes = await fetch(`${BASE_URL}/api/stats/public`);
    const statsData = await statsRes.json();
    assert(statsRes.ok && statsData.registeredFarmers >= 2, 'Public stats endpoint returns live farmer count');
    assert(statsData.activeProgrammes >= 2, 'Public stats endpoint returns active carbon projects');

    // 2. Demo Admin Login
    console.log('\n--- 2. Testing Central Operations Admin Login ---');
    const adminLoginRes = await fetch(`${BASE_URL}/api/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'admin' })
    });
    const adminData = await adminLoginRes.json();
    assert(adminLoginRes.ok && adminData.token, 'Admin demo login succeeds and returns valid JWT');
    const adminToken = adminData.token;

    // 3. Admin Overview Telemetry
    console.log('\n--- 3. Testing Admin Dashboard Metrics ---');
    const adminStatsRes = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const adminStats = await adminStatsRes.json();
    assert(adminStats.totalFarmers >= 2, 'Admin stats report total registered farmers');
    assert(adminStats.sampleFarmers >= 2, 'Admin stats distinguish sample demo records from live');

    // 4. Register a Brand New Farmer (Workflow 1)
    console.log('\n--- 4. Testing Workflow 1: New Farmer Registration ---');
    const newFarmerEmail = `vikas.soren.${Date.now()}@testfarm.in`;
    const regFarmerRes = await fetch(`${BASE_URL}/api/auth/register-farmer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Vikas Soren',
        email: newFarmerEmail,
        phone: '+91 94711 55667',
        password: 'Password@123',
        state: 'Jharkhand',
        district: 'Ranchi',
        village: 'Ormanjhi Block, Chakla',
        pincode: '835219',
        farmArea: 3.5,
        areaUnit: 'acres',
        primaryActivity: 'Grain & Cereal Cultivation (Paddy, Wheat, Maize)',
        currentCrop: 'Paddy (Rice)',
        previousCrop: 'Wheat & Mustard',
        irrigationSource: 'Borewell / Tube Well',
        farmingPractices: 'Zero-till trial with organic farmyard manure',
        soilReportAvailable: true
      })
    });
    const farmerAuth = await regFarmerRes.json();
    assert(regFarmerRes.ok && farmerAuth.token, 'New farmer registered successfully with authenticated JWT');
    const farmerToken = farmerAuth.token;
    const farmerId = farmerAuth.user.id;

    // Verify farmer immediately appears in Admin Dashboard
    const adminFarmersRes = await fetch(`${BASE_URL}/api/admin/farmers`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const allFarmers = await adminFarmersRes.json();
    const foundFarmer = allFarmers.find(f => f.email === newFarmerEmail);
    assert(foundFarmer && foundFarmer.full_name === 'Vikas Soren', 'New live farmer immediately visible in Admin Dashboard');
    assert(foundFarmer && foundFarmer.is_demo === 0, 'New live farmer marked with Live Verified Submission badge (is_demo = 0)');

    // 5. Farmer Edits Farm Profile
    console.log('\n--- 5. Testing Farmer Farm Profile Editing & Persistence ---');
    const updateProfileRes = await fetch(`${BASE_URL}/api/farmer/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${farmerToken}`
      },
      body: JSON.stringify({
        farmArea: 4.2,
        currentCrop: 'Direct Seeded Rice (DSR) + Green Manure',
        farmingPractices: 'Direct seeding with Sesbania cover crop'
      })
    });
    const updateProfileData = await updateProfileRes.json();
    assert(updateProfileRes.ok && updateProfileData.profile.farm_area === 4.2, 'Farmer profile edit saved to database');

    // Admin updates farmer review status
    const updateFarmerStatusRes = await fetch(`${BASE_URL}/api/admin/farmers/${foundFarmer.id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'Verified Profile' })
    });
    assert(updateFarmerStatusRes.ok, 'Admin updates farmer status to Verified Profile');

    // Farmer checks refreshed profile
    const refreshedProfileRes = await fetch(`${BASE_URL}/api/farmer/profile`, {
      headers: { Authorization: `Bearer ${farmerToken}` }
    });
    const refreshedProfile = await refreshedProfileRes.json();
    assert(refreshedProfile.profile_status === 'Verified Profile', 'Farmer dashboard immediately reflects Admin status change');

    // 6. Soil Assessment Workflow (Workflow 2 & 3)
    console.log('\n--- 6. Testing Workflow 2 & 3: Soil Assessment & Agronomy Guidance ---');
    const reqAssessRes = await fetch(`${BASE_URL}/api/farmer/assessments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${farmerToken}`
      },
      body: JSON.stringify({
        soilType: 'Red / Lateritic Sandy Soil',
        notes: 'Requesting baseline soil carbon test and Kharif crop rotation review.',
        existingReportFilename: 'soil_health_card_vikas.pdf'
      })
    });
    const assessData = await reqAssessRes.json();
    assert(reqAssessRes.ok && assessData.request.id.startsWith('SAR-2026-'), 'Soil assessment request created with unique SAR ID');
    const sarId = assessData.request.id;

    // Admin reviews assessment, assigns agronomist, and adds certified recommendations
    const adminAssessUpdateRes = await fetch(`${BASE_URL}/api/admin/assessments/${sarId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        status: 'Reviewed',
        assignedExpert: 'Dr. R. K. Singh (ICAR-CRURRS Senior Agronomist)',
        adminNotes: 'Soil core carbon baseline verified: 0.48% OC.',
        farmerVisibleNotes: 'Baseline organic carbon is 0.48%. Transitioning to DSR and Sesbania green manuring recommended.',
        expertRecommendations: '1. Sowing: DSR with Sesbania brown manuring at 25 kg/ha.\n2. Summer Legume: Green gram (Moong) after Rabi wheat.'
      })
    });
    assert(adminAssessUpdateRes.ok, 'Admin assigns expert and records certified agronomy recommendations');

    // Farmer views reviewed assessment
    const farmerAssessmentsRes = await fetch(`${BASE_URL}/api/farmer/assessments`, {
      headers: { Authorization: `Bearer ${farmerToken}` }
    });
    const farmerAssessments = await farmerAssessmentsRes.json();
    const updatedSar = farmerAssessments.find(a => a.id === sarId);
    assert(updatedSar && updatedSar.status === 'Reviewed', 'Farmer sees assessment status updated to Reviewed');
    assert(updatedSar && updatedSar.assigned_expert.includes('ICAR-CRURRS'), 'Farmer sees assigned expert agronomist name');
    assert(updatedSar && updatedSar.expert_recommendations.includes('Sesbania'), 'Farmer sees certified recommendations');

    // 7. Equipment Support Workflow (Workflow 4)
    console.log('\n--- 7. Testing Workflow 4: Equipment Support Requisition ---');
    const eqReqRes = await fetch(`${BASE_URL}/api/farmer/equipment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${farmerToken}`
      },
      body: JSON.stringify({
        equipmentCategory: 'Zero-till / Reduced Tillage Seed Drill (Happy Seeder / DSR)',
        intendedPractice: 'Direct Seeded Rice into residual moisture without field burning',
        farmLocation: 'Ormanjhi Block, Ranchi',
        farmArea: '4.2 acres',
        requiredPeriod: 'Upcoming Kharif Window (June 10 - June 25)',
        additionalDetails: 'Requires 45+ HP tractor operator compatible with seed drill.'
      })
    });
    const eqData = await eqReqRes.json();
    assert(eqReqRes.ok && eqData.request.id.startsWith('EQR-2026-'), 'Equipment request submitted with unique EQR ID');
    const eqrId = eqData.request.id;

    // Admin updates equipment request status
    const adminEqUpdateRes = await fetch(`${BASE_URL}/api/admin/equipment/${eqrId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        status: 'Partner Search',
        adminNotes: 'Contacted Ormanjhi FPO machinery bank; verifying tractor operator availability.',
        farmerVisibleNotes: 'Coordinating with Ormanjhi FPO machinery bank. Unit allocation scheduled for June 12.'
      })
    });
    assert(adminEqUpdateRes.ok, 'Admin advances equipment requisition to Partner Search with shared note');

    // Farmer views equipment request
    const farmerEqListRes = await fetch(`${BASE_URL}/api/farmer/equipment`, {
      headers: { Authorization: `Bearer ${farmerToken}` }
    });
    const farmerEqList = await farmerEqListRes.json();
    const updatedEqr = farmerEqList.find(e => e.id === eqrId);
    assert(updatedEqr && updatedEqr.status === 'Partner Search', 'Farmer dashboard reflects Partner Search equipment status');
    assert(updatedEqr && updatedEqr.farmer_visible_notes.includes('Ormanjhi FPO'), 'Farmer sees shared CHC dispatch update');

    // 8. Company Registration & Buyer Inquiries (Workflow 5)
    console.log('\n--- 8. Testing Workflow 5: Corporate Buyer Registration & Inquiry ---');
    const newCompanyEmail = `procurement.${Date.now()}@agricarbon.example.com`;
    const regCompanyRes = await fetch(`${BASE_URL}/api/auth/register-company`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: 'AgriCarbon Solutions International',
        contactPerson: 'Siddharth Mehra',
        businessEmail: newCompanyEmail,
        phone: '+91 98101 22334',
        companyType: 'Corporate ESG Buyer / Sustainability Aggregator',
        password: 'Password@123',
        website: 'https://agricarbon-solutions.example.com',
        state: 'Karnataka',
        district: 'Bengaluru Urban',
        areaOfInterest: 'Soil organic carbon addition in Eastern India rice-wheat systems'
      })
    });
    const companyAuth = await regCompanyRes.json();
    assert(regCompanyRes.ok && companyAuth.token, 'New buyer entity registered with authenticated JWT');
    const companyToken = companyAuth.token;

    // Submit Buyer Requirement Inquiry
    const inqRes = await fetch(`${BASE_URL}/api/company/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${companyToken}`
      },
      body: JSON.stringify({
        projectType: 'Soil Organic Carbon (SOC) Sequestration',
        preferredRegion: 'Jharkhand & Bihar',
        requiredCharacteristics: 'Gold Standard / Verra VM0042 methodology with direct farmer benefit transfer',
        requestedQuantity: '8,000 tCO2e',
        indicativeTimeline: '2026-2027 Crop Cycles',
        additionalRequirements: 'Digital satellite MRV audits mandatory.'
      })
    });
    const inqData = await inqRes.json();
    assert(inqRes.ok && inqData.inquiry.id.startsWith('INQ-2026-'), 'Buyer inquiry submitted with unique INQ ID');
    const inqId = inqData.inquiry.id;

    // Admin maps inquiry and updates status
    const adminInqUpdateRes = await fetch(`${BASE_URL}/api/admin/inquiries/${inqId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        status: 'Potential Match Under Review',
        potentialMatches: 'Cluster JH-02 (Ranchi & Ramgarh Aggregation - 80 Smallholders)',
        internalNotes: 'Feasibility confirmed for DSR pilot cluster.',
        companyVisibleNotes: 'Requirement tentatively mapped to Cluster JH-02 (Ranchi & Ramgarh). Agronomic audit in progress.'
      })
    });
    assert(adminInqUpdateRes.ok, 'Admin maps tentative cluster match and updates buyer inquiry status');

    // Company verifies updated inquiry
    const companyInquiriesRes = await fetch(`${BASE_URL}/api/company/inquiries`, {
      headers: { Authorization: `Bearer ${companyToken}` }
    });
    const companyInquiries = await companyInquiriesRes.json();
    const updatedInq = companyInquiries.find(i => i.id === inqId);
    assert(updatedInq && updatedInq.status === 'Potential Match Under Review', 'Company dashboard reflects Potential Match status');
    assert(updatedInq && updatedInq.potential_matches.includes('Cluster JH-02'), 'Company sees mapped tentative cluster');

    // 9. Carbon Programme Project Creation & 9-Stage Stepper (Workflow 6)
    console.log('\n--- 9. Testing Workflow 6: Carbon Programme Coordination ---');
    const createProgRes = await fetch(`${BASE_URL}/api/admin/programmes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        projectName: 'Ranchi Plateau Regenerative Agriculture Transition',
        farmerId: farmerId,
        practiceType: 'Direct Seeded Rice & Legume Green Manure',
        targetAcres: 4.2,
        stage: 'Practice Adoption and Training',
        projectPartner: 'ICAR-CRURRS & Gold Standard Aggregator',
        statusNotes: 'Farmer completed seed drill calibration; baseline soil test verified.'
      })
    });
    const progData = await createProgRes.json();
    assert(createProgRes.ok && progData.project.id.startsWith('CP-2026-'), 'Carbon programme project created linked to farmer');
    const progId = progData.project.id;

    // Advance Stage to 'Credits Issued' with verified credit quantity
    const advanceStageRes = await fetch(`${BASE_URL}/api/admin/programmes/${progId}/stage`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        stage: 'Credits Issued',
        notes: 'Independent registry verification audit completed; 6.3 tCO2e confirmed issued.',
        creditsConfirmedAmount: 6.3,
        projectPartner: 'Gold Standard Registry & ICAR-CRURRS'
      })
    });
    const advanceData = await advanceStageRes.json();
    assert(advanceStageRes.ok && advanceData.project.stage === 'Credits Issued', 'Programme stage advanced to Credits Issued');
    assert(advanceData.project.credits_confirmed_amount === 6.3, 'Confirmed credit amount recorded in database');

    // Farmer views carbon programme timeline
    const farmerProgRes = await fetch(`${BASE_URL}/api/farmer/programmes`, {
      headers: { Authorization: `Bearer ${farmerToken}` }
    });
    const farmerProgList = await farmerProgRes.json();
    const updatedProj = farmerProgList.find(p => p.id === progId);
    assert(updatedProj && updatedProj.stage === 'Credits Issued', 'Farmer dashboard timeline shows Credits Issued');
    assert(updatedProj && updatedProj.credits_confirmed_amount === 6.3, 'Farmer sees 6.3 tCO2e confirmed credits');

    // 10. Public Contact Form Submission
    console.log('\n--- 10. Testing Public Contact Form ---');
    const contactRes = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Priyanka Sen',
        email: 'priyanka@greentrust.org',
        phone: '+91 94311 99887',
        subject: 'Research Partnership Inquiry',
        message: 'Interested in partnering with FarmSetu for Eastern India soil organic carbon verification.'
      })
    });
    assert(contactRes.ok, 'Public contact message saved to database');

    const adminContactsRes = await fetch(`${BASE_URL}/api/admin/contacts`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const adminContacts = await adminContactsRes.json();
    const foundContact = adminContacts.find(c => c.email === 'priyanka@greentrust.org');
    assert(foundContact && foundContact.name === 'Priyanka Sen', 'Contact submission immediately visible in Admin Dashboard');

    // 11. Security & Data Isolation
    console.log('\n--- 11. Testing Role Security & Data Isolation ---');
    const unauthorizedAdminAccess = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${farmerToken}` }
    });
    assert(unauthorizedAdminAccess.status === 403, 'Farmer is forbidden (403) from accessing Admin operations');

    const unauthorizedCompanyAccess = await fetch(`${BASE_URL}/api/admin/farmers`, {
      headers: { Authorization: `Bearer ${companyToken}` }
    });
    assert(unauthorizedCompanyAccess.status === 403, 'Company is forbidden (403) from accessing Admin operations');

    // 12. Safe Demo Data Reset
    console.log('\n--- 12. Testing Safe Demo Data Reset ---');
    const resetRes = await fetch(`${BASE_URL}/api/admin/reset-demo-data`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(resetRes.ok, 'Admin safe demo reset endpoint executes cleanly');

    // Verify newly registered farmer still exists after demo data reset
    const checkFarmerAfterReset = await fetch(`${BASE_URL}/api/admin/farmers`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const farmersAfterReset = await checkFarmerAfterReset.json();
    const vikasStillExists = farmersAfterReset.find(f => f.email === newFarmerEmail);
    assert(vikasStillExists !== undefined, 'Live farmer submission is preserved after safe demo reset!');

    console.log('\n========================================================');
    console.log(`  ALL ACCEPTANCE TESTS COMPLETE! Passed: ${passed}, Failed: ${failed}`);
    console.log('========================================================');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();
