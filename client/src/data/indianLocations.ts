export interface StateDistricts {
  state: string;
  districts: string[];
}

export const INDIAN_STATES_DISTRICTS: StateDistricts[] = [
  {
    state: 'Jharkhand',
    districts: ['Ramgarh', 'Hazaribagh', 'Ranchi', 'Bokaro', 'Dhanbad', 'Giridih', 'Deoghar', 'Dumka', 'East Singhbhum', 'West Singhbhum', 'Palamu', 'Gumla', 'Chatra', 'Godda', 'Koderma', 'Lohardaga', 'Pakur', 'Sahebganj', 'Seraikela Kharsawan', 'Simdega', 'Khunti', 'Jamtara', 'Latehar', 'Garhwa']
  },
  {
    state: 'Punjab',
    districts: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Hoshiarpur', 'Firozpur', 'Fazilka', 'Moga', 'Sangrur', 'Barnala', 'Faridkot', 'Fatehgarh Sahib', 'Gurdaspur', 'Kapurthala', 'Mansa', 'Muktsar', 'Pathankot', 'Rupnagar', 'Mohali', 'Tarn Taran', 'Malerkotla']
  },
  {
    state: 'Haryana',
    districts: ['Karnal', 'Kurukshetra', 'Ambala', 'Hisar', 'Rohtak', 'Panipat', 'Sonipat', 'Sirsa', 'Fatehabad', 'Jind', 'Kaithal', 'Bhiwani', 'Rewari', 'Yamunanagar', 'Gurugram', 'Faridabad', 'Palwal', 'Panchkula', 'Mahendragarh', 'Jhajjar', 'Nuh', 'Charkhi Dadri']
  },
  {
    state: 'Uttar Pradesh',
    districts: ['Varanasi', 'Prayagraj', 'Lucknow', 'Kanpur Nagar', 'Gorakhpur', 'Meerut', 'Agra', 'Bareilly', 'Aligarh', 'Moradabad', 'Ayodhya', 'Jhansi', 'Mirzapur', 'Sonbhadra', 'Jaunpur', 'Ghazipur', 'Ballia', 'Basti', 'Barabanki', 'Sultanpur', 'Muzaffarnagar', 'Bulandshahr', 'Mathura', 'Shahjahanpur']
  },
  {
    state: 'Bihar',
    districts: ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga', 'Purnia', 'Rohtas', 'Bhojpur', 'Nalanda', 'Saran', 'Begusarai', 'Samastipur', 'Katihar', 'East Champaran', 'West Champaran', 'Vaishali', 'Siwan', 'Madhubani', 'Saharsa', 'Buxar', 'Aurangabad']
  },
  {
    state: 'Madhya Pradesh',
    districts: ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa', 'Hoshangabad (Narmadapuram)', 'Sehore', 'Vidisha', 'Khargone', 'Dhar', 'Chhindwara', 'Shivpuri', 'Mandsaur', 'Neemuch', 'Morena']
  },
  {
    state: 'Maharashtra',
    districts: ['Pune', 'Nashik', 'Nagpur', 'Aurangabad (Chhatrapati Sambhajinagar)', 'Ahmednagar (Ahilyanagar)', 'Solapur', 'Kolhapur', 'Amravati', 'Nanded', 'Jalgaon', 'Akola', 'Latur', 'Dhule', 'Satara', 'Sangli', 'Yavatmal', 'Buldhana', 'Wardha', 'Beed', 'Osmanabad (Dharashiv)', 'Mumbai Suburban']
  },
  {
    state: 'Rajasthan',
    districts: ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Alwar', 'Bharatpur', 'Sikar', 'Sri Ganganagar', 'Hanumangarh', 'Nagaur', 'Pali', 'Barmer', 'Chittorgarh', 'Bhilwara', 'Jhunjhunu', 'Tonk', 'Sawai Madhopur', 'Jhalawar']
  },
  {
    state: 'Karnataka',
    districts: ['Bengaluru Urban', 'Bengaluru Rural', 'Belagavi', 'Mysuru', 'Tumakuru', 'Hubballi-Dharwad', 'Ballari', 'Kalaburagi', 'Vijayapura', 'Shivamogga', 'Davanagere', 'Raichur', 'Bidar', 'Hassan', 'Mandya', 'Udupi', 'Chikkamagaluru', 'Kolar']
  },
  {
    state: 'Andhra Pradesh',
    districts: ['Guntur', 'Krishna', 'Visakhapatnam', 'East Godavari', 'West Godavari', 'Kurnool', 'Anantapur', 'Chittoor', 'YSR Kadapa', 'Prakasam', 'Srikakulam', 'Nellore', 'Vizianagaram']
  },
  {
    state: 'Odisha',
    districts: ['Cuttack', 'Khurda (Bhubaneswar)', 'Ganjam', 'Balasore', 'Sambalpur', 'Puri', 'Bhadrak', 'Bargarh', 'Mayurbhanj', 'Angul', 'Kalahandi', 'Koraput', 'Jajpur', 'Bolangir', 'Sundargarh', 'Kendrapara']
  },
  {
    state: 'West Bengal',
    districts: ['Bardhaman (Purba & Paschim)', 'Hooghly', 'Nadia', 'Murshidabad', 'Birbhum', 'Bankura', 'Purulia', 'North 24 Parganas', 'South 24 Parganas', 'Malda', 'Jalpaiguri', 'Cooch Behar', 'Uttar Dinajpur', 'Dakshin Dinajpur']
  },
  {
    state: 'Gujarat',
    districts: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Mehsana', 'Banaskantha', 'Sabarkantha', 'Kutch', 'Patan', 'Amreli', 'Kheda']
  },
  {
    state: 'Tamil Nadu',
    districts: ['Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Thanjavur', 'Erode', 'Tirunelveli', 'Vellore', 'Dindigul', 'Cuddalore', 'Kanchipuram', 'Thiruvarur', 'Nagapattinam', 'Theni', 'Dharmapuri']
  }
];

export const PRIMARY_FARMING_ACTIVITIES = [
  'Grain & Cereal Cultivation (Paddy, Wheat, Maize)',
  'Millets & Dryland Cereals (Ragi, Jowar, Bajra)',
  'Pulses & Legumes (Chickpea, Moong, Urad, Pigeon Pea)',
  'Oilseeds (Mustard, Groundnut, Soybean, Sunflower)',
  'Commercial Crops (Cotton, Sugarcane)',
  'Horticulture (Vegetables & Fruits)',
  'Agroforestry & Mixed Perennial Farming',
  'Integrated Crop-Livestock / Organic Farming'
];

export const IRRIGATION_SOURCES = [
  'Rainfed / Monsoon Dependent',
  'Borewell / Tube Well',
  'Canal / Government Irrigation Network',
  'Farm Pond / Check Dam',
  'Drip / Micro-Irrigation System',
  'River / Stream Lift Irrigation',
  'Open Well'
];

export const AREA_UNITS = [
  { value: 'acres', label: 'Acres (एकड़)' },
  { value: 'hectares', label: 'Hectares (हेक्टेयर)' },
  { value: 'bigha', label: 'Bigha (बीघा)' },
  { value: 'guntha', label: 'Guntha (गुंठा)' }
];
