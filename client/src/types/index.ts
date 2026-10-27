export type UserRole = 'farmer' | 'company' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  created_at?: string;
  is_demo?: number;
}

export interface FarmerProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone?: string;
  country: string;
  state: string;
  district: string;
  village: string;
  pincode?: string;
  farm_area: number;
  area_unit: 'acres' | 'hectares' | 'bigha' | 'guntha';
  primary_activity: string;
  current_crop?: string;
  previous_crop?: string;
  irrigation_source?: string;
  farming_practices?: string;
  soil_report_available: number;
  profile_status: string;
  updated_at: string;
  is_demo?: number;
  email?: string;
  registered_on?: string;
}

export interface CompanyProfile {
  id: string;
  user_id: string;
  company_name: string;
  contact_person: string;
  business_email: string;
  phone?: string;
  company_type: string;
  website?: string;
  state?: string;
  district?: string;
  area_of_interest?: string;
  updated_at: string;
  is_demo?: number;
  registered_on?: string;
}

export interface SoilAssessmentRequest {
  id: string;
  user_id: string;
  farmer_name: string;
  farm_location: string;
  farm_area: string;
  soil_type?: string;
  existing_report_filename?: string;
  notes?: string;
  status: 'Submitted' | 'Under Review' | 'Expert Review Required' | 'Reviewed';
  assigned_expert?: string;
  admin_notes?: string;
  farmer_visible_notes?: string;
  expert_recommendations?: string;
  created_at: string;
  updated_at: string;
  is_demo?: number;
}

export interface EquipmentRequest {
  id: string;
  user_id: string;
  farmer_name: string;
  equipment_category: string;
  intended_practice: string;
  farm_location: string;
  farm_area: string;
  required_period: string;
  additional_details?: string;
  status: 'Requested' | 'Reviewing' | 'Partner Search' | 'Arranged' | 'Unavailable';
  admin_notes?: string;
  farmer_visible_notes?: string;
  created_at: string;
  updated_at: string;
  is_demo?: number;
}

export interface BuyerInquiry {
  id: string;
  user_id: string;
  company_name: string;
  contact_person: string;
  business_email: string;
  phone?: string;
  project_type: string;
  preferred_region: string;
  required_characteristics: string;
  requested_quantity?: string;
  indicative_timeline?: string;
  additional_requirements?: string;
  status: 'Submitted' | 'Under Review' | 'More Information Required' | 'Potential Match Under Review' | 'Closed';
  internal_notes?: string;
  company_visible_notes?: string;
  potential_matches?: string;
  created_at: string;
  updated_at: string;
  is_demo?: number;
}

export type ProgrammeStage =
  | 'Registration'
  | 'Farm Information Submitted'
  | 'Preliminary Assessment'
  | 'Eligibility Review'
  | 'Programme/Partner Coordination'
  | 'Practice Adoption and Training'
  | 'Monitoring'
  | 'Verification Pending'
  | 'Credits Issued';

export interface ProjectStageHistory {
  id: string;
  project_id: string;
  stage: ProgrammeStage;
  notes?: string;
  updated_by?: string;
  timestamp: string;
}

export interface CarbonProgrammeProject {
  id: string;
  project_name: string;
  farmer_id: string;
  farmer_name: string;
  location: string;
  practice_type: string;
  target_acres?: number;
  stage: ProgrammeStage;
  linked_inquiry_id?: string;
  project_partner?: string;
  status_notes?: string;
  credits_confirmed_amount?: number;
  issuance_date?: string;
  updated_by_admin?: string;
  created_at: string;
  updated_at: string;
  is_demo?: number;
  history?: ProjectStageHistory[];
}

export interface AdminStats {
  totalFarmers: number;
  realFarmers: number;
  sampleFarmers: number;
  totalCompanies: number;
  realCompanies: number;
  pendingAssessments: number;
  openEquipmentRequests: number;
  buyerInquiries: number;
  activeProgrammes: number;
  recentActivity: Array<{
    id: string;
    title: string;
    type: string;
    created_at: string;
    is_demo: number;
  }>;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}
