import { LeadStatus, ProjectStatus, ProjectType } from './types';

export const STATUS_OPTIONS: LeadStatus[] = [
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
