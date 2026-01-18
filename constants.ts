
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

export const WARNING_SOUND_URL = 'https://pub-388f7f768ada498397e23af82c423ace.r2.dev/mixkit-security-facility-breach-alarm-994.wav';

// REPLACE THIS URL with the actual direct link to your hosted .apk file
// Example: 'https://mysite.com/app-release.apk' or Supabase Storage URL
export const APK_DOWNLOAD_URL = 'https://expo.dev/artifacts/eas/..../AmazCRM.apk'; 
