import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Nav
    appName: 'FarmSetu',
    tagline: 'Better Farming Decisions. Sustainable Practices. Connected Opportunities.',
    home: 'Home',
    about: 'How It Works',
    cropAnalytics: 'Crop Analytics',
    equipmentSupport: 'Equipment Support',
    carbonProgrammes: 'Carbon Programmes',
    contact: 'Contact',
    login: 'Log In',
    register: 'Register',
    farmerRegister: 'Register as Farmer',
    companyRegister: 'Register as Company',
    farmerDashboard: 'Farmer Dashboard',
    companyDashboard: 'Buyer Dashboard',
    adminDashboard: 'Admin Control Center',
    logout: 'Log Out',
    myFarm: 'My Farm',
    myInquiries: 'My Inquiries',
    submitRequirement: 'Submit Requirement',
    welcomeBack: 'Welcome back',
    demoModeNotice: 'Student Innovation Prototype MVP — Live Relational Persistence Active',

    // Hero & Home
    heroHeading: 'Better Farming Decisions. Sustainable Practices. Connected Opportunities.',
    heroSubheading: 'Empowering Indian farmers with structured farm profiles, baseline soil assessments, precision equipment coordination, and high-integrity carbon-farming pathways.',
    ctaFarmer: 'Get Started as a Farmer',
    ctaCompany: 'Register as a Company / Buyer',
    demoLoginQuick: 'Judge / Demo Fast Access',

    // Pillars
    pillar1Title: 'Smart Crop & Farm Analytics',
    pillar1Desc: 'Structured farm profiles, soil health parameters, and expert-reviewed agronomic practices suited for your local climate and season.',
    pillar2Title: 'Agricultural Equipment Support',
    pillar2Desc: 'On-demand coordination for zero-tillage seed drills, residue balers, and micro-irrigation machinery through local partner networks.',
    pillar3Title: 'Carbon Programme Coordination',
    pillar3Desc: 'Guiding smallholders toward legitimate carbon-farming programmes, monitoring practice adoption, and tracking verification milestones.',

    // How it works
    howItWorksTitle: 'How FarmSetu Works',
    howStep1Title: '1. Register & Profile Your Land',
    howStep1Desc: 'Farmers register their location, plot size, irrigation sources, and current crop rotations.',
    howStep2Title: '2. Request Soil & Health Assessment',
    howStep2Desc: 'Submit existing soil test reports or request baseline soil organic carbon (SOC) evaluation.',
    howStep3Title: '3. Receive Expert Agronomy Guidance',
    howStep3Desc: 'Qualified agronomists review plots and recommend verified regenerative practices.',
    howStep4Title: '4. Equipment & Mechanization Support',
    howStep4Desc: 'Request access to essential machinery like Happy Seeders and zero-till drills to enable residue-free farming.',
    howStep5Title: '5. Connect with Verified Carbon Programmes',
    howStep5Desc: 'Aggregated farm clusters are connected with credible carbon standards and responsible corporate buyers.',
    howStep6Title: '6. Transparent Progress & Verification',
    howStep6Desc: 'Track your project status step-by-step from onboarding to third-party verification and genuine credit issuance.',

    // Disclaimers & Transparency
    disclaimerTitle: 'Integrity & Verification Principles',
    disclaimerText: 'Actual carbon-credit eligibility and issuance depend on applicable international methodologies, rigorous soil monitoring, satellite MRV, and independent third-party verification. FarmSetu does not guarantee automated credit sales or speculative prices.',
    sampleNotice: 'Illustrative Example — Not a Validated Recommendation',
    sampleBadge: 'Sample Demo Record',
    liveBadge: 'Live Verified Submission',

    // Statuses
    statusSubmitted: 'Submitted',
    statusProfileSubmitted: 'Profile Submitted',
    statusUnderReview: 'Under Review',
    statusExpertReviewRequired: 'Expert Review Required',
    statusReviewed: 'Reviewed',
    statusRequested: 'Requested',
    statusReviewing: 'Reviewing',
    statusPartnerSearch: 'Partner Search',
    statusArranged: 'Arranged',
    statusUnavailable: 'Unavailable',
    statusMoreInfo: 'More Information Required',
    statusPotentialMatch: 'Potential Match Under Review',
    statusClosed: 'Closed',
    statusVerifiedProfile: 'Verified Profile',

    // Stages
    stageRegistration: 'Registration',
    stageFarmInfo: 'Farm Information Submitted',
    stagePrelimAssess: 'Preliminary Assessment',
    stageEligibility: 'Eligibility Review',
    stageCoordination: 'Programme/Partner Coordination',
    stageAdoption: 'Practice Adoption and Training',
    stageMonitoring: 'Monitoring',
    stageVerificationPending: 'Verification Pending',
    stageCreditsIssued: 'Credits Issued',

    // Form labels
    fullName: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    password: 'Password',
    state: 'State',
    district: 'District',
    village: 'Village / Locality',
    pincode: 'PIN Code (Optional)',
    farmArea: 'Total Farm Area',
    areaUnit: 'Unit of Area',
    primaryActivity: 'Primary Farming Activity',
    currentCrop: 'Current Crop (Current Season)',
    previousCrop: 'Previous Crop (Last Season)',
    irrigationSource: 'Irrigation & Water Source',
    farmingPractices: 'Existing Farming Practices',
    soilReportAvailable: 'Do you already have a physical soil test report?',
    companyName: 'Company / Organization Name',
    contactPerson: 'Contact Person Name',
    businessEmail: 'Business Email',
    companyType: 'Company Type / Sector',
    website: 'Website (Optional)',
    areaOfInterest: 'Area of ESG / Carbon Interest',
    projectType: 'Project / Methodology Interest',
    preferredRegion: 'Preferred State or Geographic Region',
    requiredCharacteristics: 'Required Project Characteristics & Standards',
    requestedQuantity: 'Indicative Volume (tCO2e / yr)',
    indicativeTimeline: 'Target Timeline',
    additionalRequirements: 'Additional Quality & Social Co-benefit Requirements',
    submit: 'Submit Request',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    loading: 'Processing...',
    success: 'Submitted successfully',

    // Common
    actions: 'Actions',
    status: 'Status',
    date: 'Date',
    notes: 'Notes',
    adminNotes: 'Admin Review Notes',
    sharedNotes: 'Agronomist Notes (Shared with Farmer)',
    viewDetails: 'View Details',
    edit: 'Edit',
    search: 'Search records...',
    filterByStatus: 'Filter by Status',
    allStatuses: 'All Statuses',
    noRecords: 'No records found.'
  },
  hi: {
    // Brand & Nav
    appName: 'फार्मसेतु',
    tagline: 'बेहतर खेती के निर्णय। टिकाऊ तरीके। जुड़े हुए अवसर।',
    home: 'होम',
    about: 'यह कैसे काम करता है',
    cropAnalytics: 'फसल विश्लेषण',
    equipmentSupport: 'कृषि उपकरण सहायता',
    carbonProgrammes: 'कार्बन कार्यक्रम',
    contact: 'संपर्क करें',
    login: 'लॉग इन करें',
    register: 'पंजीकरण करें',
    farmerRegister: 'किसान के रूप में पंजीकरण',
    companyRegister: 'कंपनी के रूप में पंजीकरण',
    farmerDashboard: 'किसान डैशबोर्ड',
    companyDashboard: 'कंपनी डैशबोर्ड',
    adminDashboard: 'प्रशासक नियंत्रण केंद्र',
    logout: 'लॉग आउट',
    myFarm: 'मेरा खेत',
    myInquiries: 'मेरी पूछताछ',
    submitRequirement: 'मांग दर्ज करें',
    welcomeBack: 'वापसी पर स्वागत है',
    demoModeNotice: 'छात्र नवाचार प्रोटोटाइप — डेटाबेस सक्रिय है',

    // Hero & Home
    heroHeading: 'बेहतर खेती के निर्णय। टिकाऊ तरीके। जुड़े हुए अवसर।',
    heroSubheading: 'भारतीय किसानों को सुव्यवस्थित खेत प्रोफाइल, मिट्टी जांच, सटीक कृषि मशीनरी सहायता और प्रमाणित कार्बन-खेती कार्यक्रमों से जोड़ना।',
    ctaFarmer: 'किसान के रूप में शुरू करें',
    ctaCompany: 'कंपनी / खरीदार के रूप में पंजीकरण करें',
    demoLoginQuick: 'जज / डेमो त्वरित लॉगिन',

    // Pillars
    pillar1Title: 'स्मार्ट फसल एवं खेत विश्लेषण',
    pillar1Desc: 'खेत का विवरण, मिट्टी के गुण और स्थानीय मौसम व मिट्टी के अनुकूल विशेषज्ञों द्वारा जांची गई टिकाऊ फसल सलाह।',
    pillar2Title: 'कृषि उपकरण एवं मशीनरी सहायता',
    pillar2Desc: 'जीरो-टिल सीड ड्रिल, पराली प्रबंधन यंत्र और सूक्ष्म सिंचाई उपकरणों की स्थानीय स्तर पर सुलभ व्यवस्था।',
    pillar3Title: 'कार्बन फार्मिंग कार्यक्रम समन्वय',
    pillar3Desc: 'किसानों को मान्यता प्राप्त कार्बन कार्यक्रमों से जोड़ना, टिकाऊ पद्धतियों का प्रशिक्षण और पारदर्शी सत्यापन।',

    // How it works
    howItWorksTitle: 'फार्मसेतु की कार्यप्रणाली',
    howStep1Title: '1. पंजीकरण और खेत का विवरण',
    howStep1Desc: 'किसान अपने खेत का क्षेत्रफल, राज्य, जिला, गांव, सिंचाई स्रोत और फसल चक्र दर्ज करते हैं।',
    howStep2Title: '2. मिट्टी परीक्षण एवं स्वास्थ्य मूल्यांकन',
    howStep2Desc: 'मौजूदा मृदा परीक्षण रिपोर्ट अपलोड करें या जैविक कार्बन जांच के लिए अनुरोध करें।',
    howStep3Title: '3. विशेषज्ञ कृषि सलाह',
    howStep3Desc: 'कृषि वैज्ञानिक खेत का निरीक्षण कर टिकाऊ फसल और हरी खाद के विकल्प सुझाते हैं।',
    howStep4Title: '4. आवश्यक कृषि मशीनरी की मांग',
    howStep4Desc: 'हैप्पी सीडर, सुपर सीडर या जीरो-टिल ड्रिल जैसी मशीनों की मांग दर्ज करें ताकि पराली जलाए बिना बुवाई हो सके।',
    howStep5Title: '5. प्रमाणित कार्बन कार्यक्रमों से जुड़ाव',
    howStep5Desc: 'सत्यापित कार्बन मानकों और जिम्मेदार कॉर्पोरेट खरीदारों के साथ किसान समूहों का समन्वय।',
    howStep6Title: '6. पारदर्शी प्रगति और सत्यापन',
    howStep6Desc: 'पंजीकरण से लेकर खेत निरीक्षण, निगरानी और वैध कार्बन क्रेडिट जारी होने तक हर कदम को ट्रैक करें।',

    // Disclaimers & Transparency
    disclaimerTitle: 'सत्यता एवं सत्यापन नियम',
    disclaimerText: 'वास्तविक कार्बन क्रेडिट पात्रता और जारी होना लागू वैज्ञानिक नियमों, नियमित मिट्टी निगरानी और स्वतंत्र सत्यापन पर निर्भर करता है। फार्मसेतु बिना सत्यापन के काल्पनिक लाभ का दावा नहीं करता।',
    sampleNotice: 'उदाहरणात्मक नमूना — यह व्यक्तिगत प्रमाणित सिफारिश नहीं है',
    sampleBadge: 'डेमो नमूना रिकॉर्ड',
    liveBadge: 'वास्तविक सबमिशन',

    // Statuses
    statusSubmitted: 'जमा किया गया',
    statusProfileSubmitted: 'प्रोफाइल जमा हुई',
    statusUnderReview: 'समीक्षा जारी',
    statusExpertReviewRequired: 'विशेषज्ञ समीक्षा अपेक्षित',
    statusReviewed: 'समीक्षा पूर्ण',
    statusRequested: 'अनुरोध प्राप्त',
    statusReviewing: 'समीक्षा की जा रही है',
    statusPartnerSearch: 'साझेदार की खोज',
    statusArranged: 'व्यवस्था हो गई',
    statusUnavailable: 'अनुपलब्ध',
    statusMoreInfo: 'अतिरिक्त जानकारी आवश्यक',
    statusPotentialMatch: 'संभावित मिलान की समीक्षा',
    statusClosed: 'समाप्त',
    statusVerifiedProfile: 'सत्यापित प्रोफाइल',

    // Stages
    stageRegistration: 'पंजीकरण',
    stageFarmInfo: 'खेत की जानकारी जमा हुई',
    stagePrelimAssess: 'प्रारंभिक मूल्यांकन',
    stageEligibility: 'पात्रता समीक्षा',
    stageCoordination: 'कार्यक्रम/साझेदार समन्वय',
    stageAdoption: 'टिकाऊ पद्धति अंगीकरण एवं प्रशिक्षण',
    stageMonitoring: 'निगरानी एवं डेटा संकलन',
    stageVerificationPending: 'स्वतंत्र सत्यापन लंबित',
    stageCreditsIssued: 'क्रेडिट जारी (सत्यापित)',

    // Form labels
    fullName: 'पूरा नाम',
    email: 'ईमेल पता',
    phone: 'मोबाइल नंबर',
    password: 'पासवर्ड',
    state: 'राज्य',
    district: 'जिला',
    village: 'गांव / क्षेत्र',
    pincode: 'पिन कोड (वैकल्पिक)',
    farmArea: 'खेत का कुल क्षेत्रफल',
    areaUnit: 'क्षेत्रफल की इकाई',
    primaryActivity: 'मुख्य कृषि गतिविधि',
    currentCrop: 'वर्तमान फसल (इस मौसम की)',
    previousCrop: 'पिछली फसल (पिछले मौसम की)',
    irrigationSource: 'सिंचाई का साधन',
    farmingPractices: 'वर्तमान खेती की पद्धति',
    soilReportAvailable: 'क्या आपके पास पहले से मिट्टी जांच रिपोर्ट है?',
    companyName: 'कंपनी / संस्था का नाम',
    contactPerson: 'संपर्क व्यक्ति का नाम',
    businessEmail: 'व्यावसायिक ईमेल',
    companyType: 'कंपनी का प्रकार / क्षेत्र',
    website: 'वेबसाइट (वैकल्पिक)',
    areaOfInterest: 'रुचि का क्षेत्र',
    projectType: 'कार्बन परियोजना का प्रकार',
    preferredRegion: 'पसंदीदा राज्य या क्षेत्र',
    requiredCharacteristics: 'आवश्यक परियोजना मानक',
    requestedQuantity: 'अनुमानित मात्रा (टन CO2e प्रति वर्ष)',
    indicativeTimeline: 'अनुमानित समय सीमा',
    additionalRequirements: 'अतिरिक्त शर्तें एवं सामाजिक लाभ',
    submit: 'अनुरोध भेजें',
    saveChanges: 'बदलाव सहेजें',
    cancel: 'रद्द करें',
    loading: 'प्रक्रिया जारी है...',
    success: 'सफलतापूर्वक सबमिट किया गया',

    // Common
    actions: 'कार्रवाई',
    status: 'स्थिति',
    date: 'दिनांक',
    notes: 'टिप्पणी',
    adminNotes: 'प्रशासक की आंतरिक टिप्पणी',
    sharedNotes: 'कृषि विशेषज्ञ की साझा टिप्पणी (किसान के लिए)',
    viewDetails: 'विवरण देखें',
    edit: 'संपादित करें',
    search: 'रिकॉर्ड खोजें...',
    filterByStatus: 'स्थिति अनुसार फ़िल्टर',
    allStatuses: 'सभी स्थितियां',
    noRecords: 'कोई रिकॉर्ड नहीं मिला।'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('farmsetu_lang') as Language;
    return saved === 'hi' ? 'hi' : 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('farmsetu_lang', newLang);
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
