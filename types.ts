

export interface Scheme {
  id: string;
  title: string;
  description: string;
  department: string;
  category: string; // e.g., 'Agriculture', 'Health', 'Education'
  eligibility: {
    age_min?: number;
    age_max?: number;
    income_max?: number;
    category: string[];
    other: string[];
  };
  benefits: string[];
  link: string;
}

export interface UserProfile {
  age: number;
  annualIncome: number;
  state: string;
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  occupation: 'Student' | 'Employed' | 'Unemployed' | 'Farmer' | 'Senior Citizen';
}

export type FormState = {
  [K in keyof UserProfile]: string;
};

// --- UPDATED & NEW TYPES FOR AUTH & FEATURES ---

export interface User {
    id: string;
    email: string;
    password: string; // In a real app, this would be a hash.
    name: string;
    role: 'user' | 'admin';
    bookmarkedSchemeIds: string[];
}

export type ApplicationStatus = 'Submitted' | 'In Review' | 'Approved' | 'Rejected';

export interface Application {
    id: string;
    applicationNumber: string; // Added for tracking
    userId: string;
    userName: string;
    schemeId: string;
    schemeTitle: string;
    status: ApplicationStatus;
    submittedAt: Date;
    userProfile: UserProfile; // Added to store user's data at time of submission for verification.
}

// --- NEW SchemePlan type for granular data ---
export interface SchemePlan {
    name: string;
    announcementDate: string;
    allocation: number; // in Crores
    utilization: number; // in Crores
    beneficiaryTarget: number;
    beneficiariesReached: number;
    status: 'Active' | 'Completed' | 'Upcoming';
}


// For new Accountability Page
export interface StateAccountabilityData {
    state: string;
    allocated: number; // in Crores
    utilized: number; // in Crores
    beneficiaries: number;
    utilizationTrend: 'Improving' | 'Stable' | 'Declining';
    topSchemes: { 
        name: string; 
        category: string; 
        allocated: number; // in Crores
        utilized: number; // in Crores
    }[];
    schemeWisePlan: SchemePlan[]; // NEW: Granular data for individual schemes
}

// For new Profile Page features
export interface UserDocument {
    id: string;
    name: string;
    applicationNumber: string;
    type: 'Aadhaar' | 'PAN Card' | 'Income Certificate' | 'Application Documents';
    status: 'Verified' | 'Pending' | 'Rejected';
}

export interface FamilyMember {
    id: string;
    name: string;
    relation: string;
    age: number;
}
// FIX: Add missing ThemeSettings interface
export interface ThemeSettings {
  mode: 'light' | 'dark';
  accentColor: string;
}