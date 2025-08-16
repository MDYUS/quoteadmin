
export enum LeadStatus {
  RecentlyAdded = 'Recently Added',
  Contacted = 'Contacted',
  FollowUp = 'Follow Up',
  SiteVisit = 'Site Visit',
  Booked = 'Booked'
}

export interface FileInfo {
  name: string;
  dataUrl: string; // Base64 encoded file
  type: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  budget: string;
  scope: string; // e.g., Kitchen, Living Room
  status: LeadStatus;
  details: string;
  floorPlan: FileInfo | null;
  createdAt?: string;
}

// Types for Quote Generator (Excel-style)
export interface QuoteItem {
  id: string;
  description: string;
  width: number; // in mm
  height: number; // in mm
  bwpGrade: string;
  rate: number; // per sqft
}

export interface QuoteCategory {
  title: string;
  items: QuoteItem[];
}

export interface QuoteData {
  clientName: string;
  siteLocation: string;
  date: string; // YYYY-MM-DD
  categories: QuoteCategory[];
  warranty: string;
  gstNote: string;
  terms: string;
}

export interface SiteVisit {
  id: string;
  clientName: string;
  location: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  phone: string;
}

// Types for Project Tracker
export enum ProjectStatus {
  JustStarted = 'Just Started',
  Ongoing = 'Ongoing',
  AlmostDone = 'Almost Done',
  Handovered = 'Handovered'
}

export enum ProjectType {
  FullHome = 'Full Home',
  Kitchen = 'Kitchen',
  Livingroom = 'Livingroom',
  Bedroom = 'Bedroom',
  Villa = 'Villa'
}

export interface Project {
  id: string;
  name: string;
  phone: string;
  finalBudget: number;
  status: ProjectStatus;
  floorPlan: FileInfo | null;
  quoteFile: FileInfo | null;
  type: ProjectType;
  advanceReceived: number;
  discountAmount: number;
}

// Types for Team Members
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  salary: number;
  currentProjectFor: string;
  employeeId: string;
  joinedDate: string; // YYYY-MM-DD
  projectsDoneThisMonth: number;
}

// Types for Client Communication Log
export interface ClientCommLog {
  id: string;
  clientName: string;
  phone: string;
  siteLocation: string;
  floorPlan: FileInfo | null;
  quote: FileInfo | null;
  commImages: FileInfo[];
  otherDocs: FileInfo[];
}