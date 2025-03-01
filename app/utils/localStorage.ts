import { User, Agency, Contractor, Intervention } from '../models/types';

// Define keys for localStorage
const STORAGE_KEYS = {
  USERS: 'agency_app_users',
  AGENCIES: 'agency_app_agencies',
  CONTRACTORS: 'agency_app_contractors',
  INTERVENTIONS: 'agency_app_interventions',
  CURRENT_USER: 'agency_app_current_user'
};

// Generic functions to get and set data
function getData<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function setData<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// User related functions
export function getUsers(): User[] {
  return getData<User>(STORAGE_KEYS.USERS);
}

export function getUserById(id: string): User | undefined {
  return getUsers().find(user => user.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find(user => user.email === email);
}

export function createUser(user: Omit<User, 'id' | 'createdAt'>): User {
  const users = getUsers();
  const newUser: User = {
    ...user,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  setData(STORAGE_KEYS.USERS, [...users, newUser]);
  return newUser;
}

// Agency related functions
export function getAgencies(): Agency[] {
  return getData<Agency>(STORAGE_KEYS.AGENCIES);
}

export function getAgencyById(id: string): Agency | undefined {
  return getAgencies().find(agency => agency.id === id);
}

export function getAgencyByUserId(userId: string): Agency | undefined {
  return getAgencies().find(agency => agency.userId === userId);
}

export function createAgency(agency: Omit<Agency, 'id'>): Agency {
  const agencies = getAgencies();
  const newAgency: Agency = {
    ...agency,
    id: Date.now().toString()
  };
  setData(STORAGE_KEYS.AGENCIES, [...agencies, newAgency]);
  return newAgency;
}

export function updateAgency(id: string, data: Partial<Agency>): Agency {
  const agencies = getAgencies();
  const index = agencies.findIndex(agency => agency.id === id);
  
  if (index === -1) throw new Error('Agency not found');
  
  const updatedAgency = { ...agencies[index], ...data };
  agencies[index] = updatedAgency;
  setData(STORAGE_KEYS.AGENCIES, agencies);
  
  return updatedAgency;
}

// Contractor related functions
export function getContractors(): Contractor[] {
  return getData<Contractor>(STORAGE_KEYS.CONTRACTORS);
}

export function getContractorById(id: string): Contractor | undefined {
  return getContractors().find(contractor => contractor.id === id);
}

export function getContractorByUserId(userId: string): Contractor | undefined {
  return getContractors().find(contractor => contractor.userId === userId);
}

export function createContractor(contractor: Omit<Contractor, 'id'>): Contractor {
  const contractors = getContractors();
  const newContractor: Contractor = {
    ...contractor,
    id: Date.now().toString()
  };
  setData(STORAGE_KEYS.CONTRACTORS, [...contractors, newContractor]);
  return newContractor;
}

export function updateContractor(id: string, data: Partial<Contractor>): Contractor {
  const contractors = getContractors();
  const index = contractors.findIndex(contractor => contractor.id === id);
  
  if (index === -1) throw new Error('Contractor not found');
  
  const updatedContractor = { ...contractors[index], ...data };
  contractors[index] = updatedContractor;
  setData(STORAGE_KEYS.CONTRACTORS, contractors);
  
  return updatedContractor;
}

// Intervention related functions
export function getInterventions(): Intervention[] {
  return getData<Intervention>(STORAGE_KEYS.INTERVENTIONS);
}

export function getInterventionById(id: string): Intervention | undefined {
  return getInterventions().find(intervention => intervention.id === id);
}

export function getInterventionsByAgencyId(agencyId: string): Intervention[] {
  return getInterventions().filter(intervention => intervention.agencyId === agencyId);
}

export function getInterventionsByContractorId(contractorId: string): Intervention[] {
  return getInterventions().filter(intervention => intervention.contractorId === contractorId);
}

export function createIntervention(intervention: Omit<Intervention, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Intervention {
  const interventions = getInterventions();
  const newIntervention: Intervention = {
    ...intervention,
    id: Date.now().toString(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  setData(STORAGE_KEYS.INTERVENTIONS, [...interventions, newIntervention]);
  return newIntervention;
}

export function updateIntervention(id: string, data: Partial<Intervention>): Intervention {
  const interventions = getInterventions();
  const index = interventions.findIndex(intervention => intervention.id === id);
  
  if (index === -1) throw new Error('Intervention not found');
  
  const updatedIntervention = { 
    ...interventions[index], 
    ...data,
    updatedAt: new Date().toISOString()
  };
  interventions[index] = updatedIntervention;
  setData(STORAGE_KEYS.INTERVENTIONS, interventions);
  
  return updatedIntervention;
}

// Authentication related functions
export function setCurrentUser(userId: string): void {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId);
}

export function getCurrentUserId(): string | null {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
}

export function getCurrentUser(): User | null {
  const userId = getCurrentUserId();
  if (!userId) return null;
  return getUserById(userId) || null;
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

// Initialize with some sample data (only in development)
export function initializeData(): void {
  // Check if data already exists
  if (getUsers().length > 0) return;
  
  // Sample users
  const users: User[] = [
    {
      id: '1',
      email: 'agency@example.com',
      role: 'agency',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      email: 'contractor@example.com',
      role: 'contractor',
      createdAt: new Date().toISOString()
    }
  ];
  
  // Sample agencies
  const agencies: Agency[] = [
    {
      id: '1',
      userId: '1',
      name: 'Banque Nationale',
      manager: 'Jean Dupont',
      address: '123 Avenue des Finances, 75001 Paris',
      openingHours: 'Lun-Ven: 9h-17h',
      phone: '+33123456789'
    }
  ];
  
  // Sample contractors
  const contractors: Contractor[] = [
    {
      id: '1',
      userId: '2',
      companyName: 'Réparations Pro',
      phone: '+33987654321'
    }
  ];
  
  // Sample interventions
  const interventions: Intervention[] = [
    {
      id: '1',
      agencyId: '1',
      contractorId: '1',
      description: 'Réparation du système de sécurité',
      requestedDate: '2025-03-15',
      location: 'Salle des coffres',
      documents: [],
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  // Save to localStorage
  setData(STORAGE_KEYS.USERS, users);
  setData(STORAGE_KEYS.AGENCIES, agencies);
  setData(STORAGE_KEYS.CONTRACTORS, contractors);
  setData(STORAGE_KEYS.INTERVENTIONS, interventions);
}