"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import * as localStorageService from "../utils/localStorage";
import { Agency, Contractor, Intervention } from "../models/types";
import Card from "../components/Card";
import Button from "../components/Button";

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<Agency | Contractor | null>(
    null
  );
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!user) {
      router.push("/login");
      return;
    }

    // Check if user has a profile
    if (user.role === "agency") {
      const agency = localStorageService.getAgencyByUserId(user.id);
      if (!agency) {
        router.push("/profile-setup");
        return;
      }
      setUserProfile(agency);

      // Get interventions for this agency
      const agencyInterventions =
        localStorageService.getInterventionsByAgencyId(agency.id);
      setInterventions(agencyInterventions);
    } else if (user.role === "contractor") {
      const contractor = localStorageService.getContractorByUserId(user.id);
      if (!contractor) {
        router.push("/profile-setup");
        return;
      }
      setUserProfile(contractor);

      // Get interventions for this contractor
      const contractorInterventions =
        localStorageService.getInterventionsByContractorId(contractor.id);
      setInterventions(contractorInterventions);
    }
  }, [user, router]);

  const getFilteredInterventions = () => {
    if (filter === "all") {
      return interventions;
    }
    return interventions.filter(
      (intervention) => intervention.status === filter
    );
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "signedOff":
        return "bg-purple-100 text-purple-800";
      case "invoiced":
        return "bg-orange-100 text-orange-800";
      case "paid":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "scheduled":
        return "Scheduled";
      case "completed":
        return "Completed";
      case "signedOff":
        return "Signed Off";
      case "invoiced":
        return "Invoiced";
      case "paid":
        return "Paid";
      default:
        return status;
    }
  };

  if (!user || !userProfile) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Tableau de Bord
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {user.role === "agency" ? (
                <>Bienvenue, {(userProfile as Agency).name}</>
              ) : (
                <>Bienvenue, {(userProfile as Contractor).companyName}</>
              )}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            {user.role === "agency" && (
              <Link href="/request-intervention">
                <Button>Nouvelle demande d&apos;intervention</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Interventions
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === "all"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === "pending"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
            onClick={() => setFilter("pending")}
          >
            En attente
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === "scheduled"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
            onClick={() => setFilter("scheduled")}
          >
            Planifié
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === "completed"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
            onClick={() => setFilter("completed")}
          >
            Complété
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === "signedOff"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
            onClick={() => setFilter("signedOff")}
          >
            Signé
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === "invoiced"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
            onClick={() => setFilter("invoiced")}
          >
            Facturé
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === "paid"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
            onClick={() => setFilter("paid")}
          >
            Payé
          </button>
        </div>
      </div>

      {/* Intervention List */}
      {getFilteredInterventions().length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900">
              Aucune interventions disponible
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {user.role === "agency" ? (
                <>Commencer par demander une interventions </>
              ) : (
                <>Aucune intervention ne vous as été assigné.</>
              )}
            </p>
            {user.role === "agency" && (
              <div className="mt-6">
                <Link href="/request-intervention">
                  <Button>Demander une nouvelle intervention</Button>
                </Link>
              </div>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {getFilteredInterventions().map((intervention) => (
            <div
              key={intervention.id}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {intervention.description}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                      intervention.status
                    )}`}
                  >
                    {getStatusLabel(intervention.status)}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date souhaité</p>
                    <p className="text-sm font-medium">
                      {intervention.requestedDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Adresse</p>
                    <p className="text-sm font-medium">
                      {intervention.location}
                    </p>
                  </div>
                  {intervention.scheduledDate && (
                    <div>
                      <p className="text-sm text-gray-500">Date planifié</p>
                      <p className="text-sm font-medium">
                        {intervention.scheduledDate}
                      </p>
                    </div>
                  )}
                  {intervention.scheduledTime && (
                    <div>
                      <p className="text-sm text-gray-500">Horaire Planifié</p>
                      <p className="text-sm font-medium">
                        {intervention.scheduledTime}
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <Link href={`/interventions/${intervention.id}`}>
                    <Button variant="outline" fullWidth>
                      Voir les détails
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
