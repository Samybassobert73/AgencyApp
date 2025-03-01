'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import * as localStorageService from '../utils/localStorage';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

export default function ProfileSetup() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Agency fields
  const [agencyName, setAgencyName] = useState('');
  const [agencyManager, setAgencyManager] = useState('');
  const [agencyAddress, setAgencyAddress] = useState('');
  const [agencyHours, setAgencyHours] = useState('');
  const [agencyPhone, setAgencyPhone] = useState('');
  
  // Contractor fields
  const [companyName, setCompanyName] = useState('');
  const [contractorPhone, setContractorPhone] = useState('');
  
  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Check if user already has a profile
    if (user.role === 'agency') {
      const agency = localStorageService.getAgencyByUserId(user.id);
      if (agency) {
        router.push('/dashboard');
      }
    } else if (user.role === 'contractor') {
      const contractor = localStorageService.getContractorByUserId(user.id);
      if (contractor) {
        router.push('/dashboard');
      }
    }
  }, [user, router]);

  const handleAgencySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!agencyName || !agencyManager || !agencyAddress || !agencyHours || !agencyPhone) {
      setError('All fields are required');
      return;
    }
    
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error('Not authenticated');
      }
      
      // Create agency profile
      localStorageService.createAgency({
        userId: user.id,
        name: agencyName,
        manager: agencyManager,
        address: agencyAddress,
        openingHours: agencyHours,
        phone: agencyPhone
      });
      
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleContractorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!companyName || !contractorPhone) {
      setError('All fields are required');
      return;
    }
    
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error('Not authenticated');
      }
      
      // Create contractor profile
      localStorageService.createContractor({
        userId: user.id,
        companyName: companyName,
        phone: contractorPhone
      });
      
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Will redirect to login in useEffect
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Retour au tableau de bord
        </button>
      </div>
      
      <Card title="Compléter votre profil">
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}
        
        {user.role === 'agency' ? (
          <form onSubmit={handleAgencySubmit} className="space-y-6">
            <div>
              <Input
                id="agency-name"
                label="Agency Name"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Input
                id="agency-manager"
                label="Manager Name"
                value={agencyManager}
                onChange={(e) => setAgencyManager(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Input
                id="agency-address"
                label="Full Address"
                value={agencyAddress}
                onChange={(e) => setAgencyAddress(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Input
                id="agency-hours"
                label="Opening Hours"
                placeholder="e.g. Mon-Fri: 9am-5pm"
                value={agencyHours}
                onChange={(e) => setAgencyHours(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Input
                id="agency-phone"
                label="Phone Number"
                type="tel"
                value={agencyPhone}
                onChange={(e) => setAgencyPhone(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Button
                type="submit"
                fullWidth
                isLoading={loading}
              >
                Save Profile
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleContractorSubmit} className="space-y-6">
            <div>
              <Input
                id="company-name"
                label="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Input
                id="contractor-phone"
                label="Phone Number"
                type="tel"
                value={contractorPhone}
                onChange={(e) => setContractorPhone(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Button
                type="submit"
                fullWidth
                isLoading={loading}
              >
                Save Profile
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}