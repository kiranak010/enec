export const PAGE_STATUSES = ['DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED'] as const
export const NEWS_STATUSES = ['DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED'] as const
export const PROJECT_STATUSES = [
  'PLANNED',
  'UNDER_DEVELOPMENT',
  'CONSTRUCTION',
  'OPERATIONAL',
  'COMPLETED',
  'DECOMMISSIONED',
] as const
export const JOB_STATUSES = ['DRAFT', 'PUBLISHED', 'CLOSED'] as const
export const EMPLOYMENT_TYPES = [
  'FULL_TIME',
  'PART_TIME',
  'CONTRACT',
  'INTERNSHIP',
  'GRADUATE',
] as const
export const APPLICATION_STATUSES = [
  'RECEIVED',
  'SCREENING',
  'INTERVIEW',
  'ASSESSMENT',
  'OFFER',
  'HIRED',
  'REJECTED',
  'WITHDRAWN',
] as const
export const DOCUMENT_CATEGORIES = [
  'ANNUAL_REPORT',
  'SUSTAINABILITY_REPORT',
  'CORPORATE_PRESENTATION',
  'TECHNICAL_REPORT',
  'POLICY',
  'PUBLICATION',
  'PRESS_RELEASE',
] as const
export const ROLES = [
  'SUPER_ADMIN',
  'ADMIN',
  'EDITOR',
  'HR_MANAGER',
  'MEDIA_MANAGER',
  'ANALYST',
  'VIEWER',
] as const
export const ALL_ROLES = ROLES

export function isSuperAdminRole(role: string): boolean {
  return role === 'SUPER_ADMIN'
}
export const MEDIA_TYPES = ['image', 'pdf', 'document', 'video'] as const

/** "UNDER_DEVELOPMENT" -> "Under Development" */
export function pretty(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export type BadgeTone =
  | 'green'
  | 'amber'
  | 'red'
  | 'cyan'
  | 'blue'
  | 'violet'
  | 'slate'

const TONE_BY_STATUS: Record<string, BadgeTone> = {
  PUBLISHED: 'green',
  ACTIVE: 'green',
  OPERATIONAL: 'green',
  COMPLETED: 'green',
  HIRED: 'green',
  OFFER: 'cyan',
  DRAFT: 'amber',
  SCHEDULED: 'amber',
  PLANNED: 'amber',
  UNDER_DEVELOPMENT: 'amber',
  CONSTRUCTION: 'amber',
  SCREENING: 'amber',
  RECEIVED: 'amber',
  INTERVIEW: 'blue',
  ASSESSMENT: 'violet',
  CLOSED: 'red',
  ARCHIVED: 'red',
  DECOMMISSIONED: 'red',
  REJECTED: 'red',
  WITHDRAWN: 'red',
}

/** Map a known status / role value to a badge tone. */
export function badgeTone(status: string): BadgeTone {
  if (status in TONE_BY_STATUS) return TONE_BY_STATUS[status]
  return 'slate'
}

export function inferMediaType(mimeType: string, filename: string): string {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType === 'application/pdf' || filename.toLowerCase().endsWith('.pdf')) return 'pdf'
  if (mimeType.startsWith('video/')) return 'video'
  return 'document'
}