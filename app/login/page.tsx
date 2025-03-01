'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Login() {
  const router = useRouter();
  const { login, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (!email || !password) {
      setFormError('Email and password are required');
      return;
    }
    
    try {
      setLoading(true);
      await login(email, password);
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
      
      <Card title="Connexion à votre compte">
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
              autoComplete="current-password"
              required
            />
          </div>

          <div>
            <Button
              type="submit"
              fullWidth
              isLoading={loading}
            >
              Connexion
            </Button>
          </div>
          
          <div className="text-center text-sm">
            <span className="text-gray-500">
              Pas encore de compte ?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-500">
                Inscrivez-vous ici
              </Link>
            </span>
          </div>
        </form>
      </Card>
      
      <div className="mt-8 text-center">
        <h2 className="text-xl font-bold mb-4">Comptes de démonstration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-medium">Agence bancaire</h3>
            <p className="text-sm text-gray-500 mb-2">agency@example.com</p>
            <p className="text-sm text-gray-500">(Mot de passe au choix)</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-medium">Prestataire</h3>
            <p className="text-sm text-gray-500 mb-2">contractor@example.com</p>
            <p className="text-sm text-gray-500">(Mot de passe au choix)</p>
          </div>
        </div>
      </div>
    </div>
  );
}