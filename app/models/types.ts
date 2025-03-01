export type UserRole = 'agency' | 'contractor';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Agency {
  id: string;
  userId: string;
  name: string;
  manager: string;
  address: string;
  openingHours: string;
  phone: string;
}

export interface Contractor {
  id: string;
  userId: string;
  companyName: string;
  phone: string;
}

export type InterventionStatus = 
  | 'pending' // Created by agency, waiting for contractor
  | 'scheduled' // Scheduled by contractor
  | 'completed' // Completed, waiting for PV
  | 'signedOff' // PV submitted, waiting for invoice
  | 'invoiced' // Invoice sent
  | 'paid'; // Invoice paid

export interface Intervention {
  id: string;
  agencyId: string;
  contractorId: string;
  description: string;
  requestedDate: string;
  location: string;
  documents: string[]; // URLs or base64 strings
  status: InterventionStatus;
  scheduledDate?: string;
  scheduledTime?: string;
  team?: string;
  comments?: string;
  pv?: {
    content: string;
    attachments: string[];
    submittedAt: string;
  };
  signature?: string; // Base64 encoded signature
  invoice?: {
    fileUrl: string;
    sentAt: string;
    paidAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}