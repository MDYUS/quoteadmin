import { LeadStatus, ProjectStatus, ProjectType } from './types';

export const STATUS_OPTIONS: LeadStatus[] = [
  LeadStatus.RecentlyAdded,
  LeadStatus.Contacted,
  LeadStatus.FollowUp,
  LeadStatus.SiteVisit,
  LeadStatus.Booked,
];

export const PROJECT_STATUS_OPTIONS: ProjectStatus[] = [
  ProjectStatus.JustStarted,
  ProjectStatus.Ongoing,
  ProjectStatus.AlmostDone,
  ProjectStatus.Handovered,
];

export const PROJECT_TYPE_OPTIONS: ProjectType[] = [
  ProjectType.FullHome,
  ProjectType.Kitchen,
  ProjectType.Livingroom,
  ProjectType.Bedroom,
  ProjectType.Villa,
];

// Replaced Base64 SVG with a hosted image URL for easier management.
export const LOGO_URL = 'https://res.cloudinary.com/dzvmyhpff/image/upload/v1759808706/highqualiamaz_etnjtt.webp';