'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../models/types';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Register() {
  const router = useRouter();
  const { register, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('agency');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (!email || !password || !confirmPassword) {
      setFormError('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      await register(email, password, role);
      router.push('/dashboard');
    } catch (err) {
      // Error is handled by the AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Retour à l'accueil
        </Link>
      </div>
      
      <Card title="Créer un compte">
        <form onSubmit={handleSubmit} className="space-y-6">
          {(formError || error) && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">
                {formError || error}
              </div>
            </div>
          )}
          
          <div>
            <Input
              id="email"
              type="email"
              label="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <Input
              id="password"
              type="password"
              label="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
          
          <div>
            <Input
              id="confirm-password"
              type="password"
              label="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Je suis :
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div 
                className={`border rounded-md px-4 py-3 cursor-pointer transition-colors ${
                  role === 'agency' ? 'bg-blue-50 border-blue-500' : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => setRole('agency')}
              >
                <div className="font-medium">Agence bancaire</div>
                <div className="text-sm text-gray-500">Demander des interventions</div>
              </div>
              <div 
                className={`border rounded-md px-4 py-3 cursor-pointer transition-colors ${
                  role === 'contractor' ? 'bg-blue-50 border-blue-500' : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => setRole('contractor')}
              >
                <div className="font-medium">Prestataire</div>
                <div className="text-sm text-gray-500">Fournir des services</div>
              </div>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              fullWidth
              isLoading={loading}
            >
              S'inscrire
            </Button>
          </div>
          
          <div className="text-center text-sm">
            <span className="text-gray-500">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-500">
                Connectez-vous ici
              </Link>
            </span>
          </div>
        </form>
      </Card>
    </div>
  );
}