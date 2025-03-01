"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Function to check if link is active
  const isActive = (path: string) => {
    return pathname === path;
  };

  // If path is /interventions/[id], mark /interventions as active
  const isInterventionsActive = () => {
    return pathname.startsWith("/interventions");
  };

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden bg-white shadow fixed top-0 left-0 right-0 z-10">
        <div className="flex items-center justify-between h-16 px-4">
          <Link
            href={user ? "/dashboard" : "/"}
            className="text-xl font-bold text-blue-600"
          >
            AgencyApp
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-500 focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/dashboard")
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Tableau de bord
                </Link>

                {user.role === "agency" && (
                  <Link
                    href="/request-intervention"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive("/request-intervention")
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Demande d&apos;intervention
                  </Link>
                )}

                {user.role === "contractor" && (
                  <Link
                    href="/interventions"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isInterventionsActive()
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Interventions
                  </Link>
                )}
              </>
            )}

            {user ? (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center px-3 mb-3">
                  <div className="flex-shrink-0">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <span className="text-sm font-medium leading-none text-blue-800">
                        {user.email.charAt(0).toUpperCase()}
                      </span>
                    </span>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user.email}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      Rôle: {user.role === "agency" ? "Agence" : "Prestataire"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-screen fixed left-0 top-0 w-64 bg-white shadow-lg flex-col">
        <div className="p-5">
          <Link
            href="/dashboard"
            className="text-2xl font-bold text-blue-600 block mb-10"
          >
            AgencyApp
          </Link>

          <nav className="space-y-1 mb-10">
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className={`flex items-center px-4 py-3 text-base font-medium rounded-md ${
                    isActive("/dashboard")
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Tableau de bord
                </Link>

                {user.role === "agency" && (
                  <Link
                    href="/request-intervention"
                    className={`flex items-center px-4 py-3 text-base font-medium rounded-md ${
                      isActive("/request-intervention")
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Demande d&apos;intervention
                  </Link>
                )}

                {user.role === "contractor" && (
                  <Link
                    href="/interventions"
                    className={`flex items-center px-4 py-3 text-base font-medium rounded-md ${
                      isInterventionsActive()
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                    Interventions
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>

        <div className="mt-auto border-t border-gray-200 p-5">
          {user ? (
            <div>
              <div className="flex items-center mb-5">
                <div className="flex-shrink-0">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <span className="text-sm font-medium leading-none text-blue-800">
                      {user.email.charAt(0).toUpperCase()}
                    </span>
                  </span>
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                    {user.email}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user.role === "agency" ? "Agence bancaire" : "Prestataire"}
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link href="/login">
                <Button variant="outline" fullWidth>
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button fullWidth>Inscription</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
