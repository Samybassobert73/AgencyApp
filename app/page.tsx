"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "./context/AuthContext";
import Button from "./components/Button";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Agence Bancaire</span>
          <span className="block text-blue-600">Gestion des Interventions</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
          Une plateforme simplifiée pour gérer les interventions dans les
          agences bancaires. Demandez, planifiez et suivez facilement les
          visites de maintenance et de service.
        </p>
        <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
          {user ? (
            <div>
              <Link href="/dashboard">
                <Button>Accéder au Tableau de Bord</Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/login">
                <Button variant="outline">Se connecter</Button>
              </Link>
              <Link href="/register">
                <Button>Créer un compte</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="mt-24">
        <div className="lg:mx-auto lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="px-4 sm:px-6 sm:text-center md:mx-auto md:max-w-2xl lg:col-span-1 lg:flex lg:items-center lg:text-left">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Pour les Agences Bancaires
              </h2>
              <p className="mt-3 text-lg text-gray-500">
                Demandez des interventions auprès de prestataires de confiance,
                suivez les progrès en temps réel, validez les travaux réalisés,
                et gérez les factures, le tout au même endroit.
              </p>
              <div className="mt-8 space-y-2">
                <div className="flex items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                      />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-700">
                    Soumission de demande facile
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                      />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-700">
                    Capacités de signature numérique
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-700">
                    Mises à jour en temps réel
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 sm:mt-16 lg:mt-0">
            <div className="pr-4 sm:pr-6 lg:px-0 lg:m-0 lg:relative lg:h-full">
              <div className="rounded-lg shadow-xl p-6 bg-white border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Demander une Intervention
                </h3>
                <div className="mt-4 space-y-4">
                  <div className="bg-gray-100 h-10 rounded-md"></div>
                  <div className="bg-gray-100 h-10 rounded-md"></div>
                  <div className="bg-gray-100 h-10 rounded-md"></div>
                  <div className="bg-gray-100 h-24 rounded-md"></div>
                  <div className="bg-blue-500 h-10 rounded-md"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 lg:mx-auto lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="lg:col-start-2 px-4 sm:px-6 sm:text-center md:mx-auto md:max-w-2xl lg:col-span-1 lg:flex lg:items-center lg:text-left">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Pour les Prestataires
              </h2>
              <p className="mt-3 text-lg text-gray-500">
                Gérer vos missions d’interventions en toute simplicité. Recevez
                les demandes des agences, planifiez vos interventions et suivez
                vos paiements.
              </p>
              <div className="mt-8 space-y-2">
                <div className="flex items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                      />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-700">
                    Gérer les missions en un clic
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-700">
                    Suivi des paiements simple
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                      />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-700">
                    Gérer les missions en temps réel
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 sm:mt-16 lg:col-start-1 lg:mt-0 lg:row-start-1">
            <div className="pl-4 sm:pl-6 lg:px-0 lg:m-0 lg:relative lg:h-full">
              <div className="rounded-lg shadow-xl p-6 bg-white border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Enregistrez votre Service
                </h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="bg-gray-100 h-8 w-1/2 rounded-md"></div>
                    <div className="bg-yellow-100 h-6 w-24 rounded-full"></div>
                  </div>
                  <div className="bg-gray-100 h-32 rounded-md"></div>
                  <div className="flex items-center justify-between">
                    <div className="bg-gray-100 h-8 w-1/2 rounded-md"></div>
                    <div className="bg-blue-100 h-6 w-24 rounded-full"></div>
                  </div>
                  <div className="bg-gray-100 h-32 rounded-md"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
