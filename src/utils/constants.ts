export const USER_ROLES = {
  USER: 'USER',
  PHARMACIST: 'PHARMACIST',
  ADMIN: 'ADMIN'
} as const;

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  DELETED: 'DELETED'
} as const;

export const REPORT_STATUS = {
  IN_STOCK: 'IN_STOCK',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  UNKNOWN: 'UNKNOWN'
} as const;

export const VERIFICATION_ACTION = {
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  EDIT: 'EDIT'
} as const;

export const MEDICINE_FORM = {
  TABLET: 'tablet',
  SYRUP: 'syrup',
  CAPSULE: 'capsule',
  INJECTABLE: 'injectable',
  OTHER: 'other'
} as const;

export const SOURCE_TYPE = {
  AGGREGATED: 'AGGREGATED',
  MANUAL: 'MANUAL',
  IMPORT: 'IMPORT'
} as const;

export const RATE_LIMITS = {
  PUBLIC_SEARCH: 120, // per minute
  AUTH_SEARCH: 240,
  REPORTING: 10,
  PHOTOS: 5,
  ADMIN: 600
} as const;

