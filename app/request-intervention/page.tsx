'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import * as localStorageService from '../utils/localStorage';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

export default function RequestIntervention() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [contractors, setContractors] = useState(localStorageService.getContractors());
  
  // Form fields
  const [description, setDescription] = useState('');
  const [requestedDate, setRequestedDate] = useState('');
  const [location, setLocation] = useState('');
  const [documents, setDocuments] = useState<string[]>([]);
  const [contractorId, setContractorId] = useState('');
  
  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!user) {
      router.push('/login');
      return;
    }
    
    // If user is not an agency, redirect to dashboard
    if (user.role !== 'agency') {
      router.push('/dashboard');
      return;
    }
    
    // Check if user has a profile
    const agency = localStorageService.getAgencyByUserId(user.id);
    if (!agency) {
      router.push('/profile-setup');
    }
  }, [user, router]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // In a real app, we would upload these files to a server
    // For this MVP, we'll just store the file names
    const fileNames = Array.from(files).map(file => file.name);
    setDocuments([...documents, ...fileNames]);
  };
  
  const removeDocument = (index: number) => {
    const newDocuments = [...documents];
    newDocuments.splice(index, 1);
    setDocuments(newDocuments);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!description || !requestedDate || !location || !contractorId) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      
      // Get agency profile
      const agency = localStorageService.getAgencyByUserId(user!.id);
      if (!agency) {
        throw new Error('Agency profile not found');
      }
      
      // Create intervention
      const intervention = localStorageService.createIntervention({
        agencyId: agency.id,
        contractorId,
        description,
        requestedDate,
        location,
        documents
      });
      
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  if (!user || user.role !== 'agency') {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Demande d'intervention</h1>
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
      
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          
          <div>
            <Input
              id="description"
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Input
              id="requested-date"
              label="Date souhaitée"
              type="date"
              value={requestedDate}
              onChange={(e) => setRequestedDate(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Input
              id="location"
              label="Lieu"
              placeholder="Ex: Entrée principale, Salle des coffres, etc."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sélectionner un prestataire
            </label>
            <select
              id="contractor"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              value={contractorId}
              onChange={(e) => setContractorId(e.target.value)}
              required
            >
              <option value="">Choisir un prestataire</option>
              {contractors.map((contractor) => (
                <option key={contractor.id} value={contractor.id}>
                  {contractor.companyName}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Documents (Optionnel)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Télécharger des fichiers</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">ou glisser-déposer</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, PDF jusqu'à 10Mo
                </p>
              </div>
            </div>
          </div>
          
          {documents.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Documents téléchargés</h3>
              <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
                {documents.map((doc, index) => (
                  <li key={index} className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2 truncate">{doc}</span>
                    </div>
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-900"
                      onClick={() => removeDocument(index)}
                    >
                      Supprimer
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div>
            <Button
              type="submit"
              fullWidth
              isLoading={loading}
            >
              Envoyer la demande
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}