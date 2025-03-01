"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import * as localStorageService from "../../utils/localStorage";
import {
  Agency,
  Contractor,
  Intervention,
  InterventionStatus,
} from "../../models/types";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Image from "next/image";
import { use } from "react";
export default function InterventionDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [intervention, setIntervention] = useState<Intervention | null>(null);
  const [agency, setAgency] = useState<Agency | null>(null);
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Schedule form fields
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [team, setTeam] = useState("");
  const [comments, setComments] = useState("");

  // PV form fields
  const [pvContent, setPvContent] = useState("");
  const [pvAttachments, setPvAttachments] = useState<string[]>([]);

  // Invoice form field
  const [invoiceFile, setInvoiceFile] = useState("");

  const signatureRef = useRef<HTMLCanvasElement>(null);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!user) {
      router.push("/login");
      return;
    }

    // Load intervention details
    const interventionData = localStorageService.getInterventionById(id);
    if (!interventionData) {
      setError("Intervention not found");
      return;
    }

    setIntervention(interventionData);

    // Load agency and contractor details
    const agencyData = localStorageService.getAgencyById(
      interventionData.agencyId
    );
    const contractorData = localStorageService.getContractorById(
      interventionData.contractorId
    );

    setAgency(agencyData || null);
    setContractor(contractorData || null);

    // Prefill form fields if intervention has data
    if (interventionData.scheduledDate) {
      setScheduledDate(interventionData.scheduledDate);
    }
    if (interventionData.scheduledTime) {
      setScheduledTime(interventionData.scheduledTime);
    }
    if (interventionData.team) {
      setTeam(interventionData.team);
    }
    if (interventionData.comments) {
      setComments(interventionData.comments);
    }
    if (interventionData.pv) {
      setPvContent(interventionData.pv.content);
      setPvAttachments(interventionData.pv.attachments);
    }
  }, [user, router, id]);

  // Function to check if the current user can perform actions on the intervention
  const canPerformAction = (requiredRole: "agency" | "contractor") => {
    if (!user || !intervention) return false;

    if (requiredRole === "agency") {
      return user.role === "agency" && agency?.userId === user.id;
    } else {
      return user.role === "contractor" && contractor?.userId === user.id;
    }
  };

  // Function to update intervention status
  const updateInterventionStatus = async (
    status: InterventionStatus,
    data: Partial<Intervention> = {}
  ) => {
    try {
      setLoading(true);

      if (!intervention) {
        throw new Error("Intervention not found");
      }

      const updatedIntervention = localStorageService.updateIntervention(
        intervention.id,
        { ...data, status }
      );

      setIntervention(updatedIntervention);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Handle scheduling by contractor
  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!scheduledDate || !scheduledTime || !team) {
      setError("Please fill in all required fields");
      return;
    }

    updateInterventionStatus("scheduled", {
      scheduledDate,
      scheduledTime,
      team,
      comments,
    });
  };

  // Handle completion by contractor
  const handleComplete = async () => {
    updateInterventionStatus("completed");
  };

  // Handle PV submission by contractor
  const handlePvSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pvContent) {
      setError("Please fill in the PV content");
      return;
    }

    updateInterventionStatus("signedOff", {
      pv: {
        content: pvContent,
        attachments: pvAttachments,
        submittedAt: new Date().toISOString(),
      },
    });
  };

  // Handle file attachment for PV
  const handlePvAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // In a real app, we would upload these files to a server
    // For this MVP, we'll just store the file names
    const fileNames = Array.from(files).map((file) => file.name);
    setPvAttachments([...pvAttachments, ...fileNames]);
  };

  // Handle invoice submission by contractor
  const handleInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!invoiceFile) {
      setError("Please select an invoice file");
      return;
    }

    updateInterventionStatus("invoiced", {
      invoice: {
        fileUrl: invoiceFile,
        sentAt: new Date().toISOString(),
      },
    });
  };

  // Handle invoice file selection
  const handleInvoiceFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // In a real app, we would upload this file to a server
    // For this MVP, we'll just store the file name
    setInvoiceFile(files[0].name);
  };

  // Handle payment confirmation by agency
  const handlePaymentConfirm = async () => {
    updateInterventionStatus("paid", {
      invoice: {
        ...intervention!.invoice!,
        paidAt: new Date().toISOString(),
      },
    });
  };

  // Handle signature capture
  const startSignature = () => {
    setIsSignatureModalOpen(true);
  };

  const clearSignature = () => {
    const canvas = signatureRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const saveSignature = () => {
    const canvas = signatureRef.current;
    if (canvas) {
      // In a real app, we would upload this signature to a server
      // For this MVP, we'll just store the dataURL
      const signatureData = canvas.toDataURL("image/png");

      updateInterventionStatus("signedOff", {
        signature: signatureData,
      });

      setIsSignatureModalOpen(false);
    }
  };

  // Signature canvas event handlers
  useEffect(() => {
    if (!isSignatureModalOpen || !signatureRef.current) return;

    const canvas = signatureRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;

      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#000";

      ctx.beginPath();

      let x, y;

      if (e instanceof MouseEvent) {
        x = e.offsetX;
        y = e.offsetY;
      } else {
        // Touch event
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        x = touch.clientX - rect.left;
        y = touch.clientY - rect.top;
      }

      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();

      lastX = x;
      lastY = y;
    };

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      isDrawing = true;

      if (e instanceof MouseEvent) {
        lastX = e.offsetX;
        lastY = e.offsetY;
      } else {
        // Touch event
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        lastX = touch.clientX - rect.left;
        lastY = touch.clientY - rect.top;
      }
    };

    const stopDrawing = () => {
      isDrawing = false;
    };

    // Mouse events
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    // Touch events
    canvas.addEventListener("touchstart", startDrawing);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", stopDrawing);

    return () => {
      // Cleanup
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseout", stopDrawing);

      canvas.removeEventListener("touchstart", startDrawing);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", stopDrawing);
    };
  }, [isSignatureModalOpen]);

  if (!user || !intervention || !agency || !contractor) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900">
              {error || "Loading..."}
            </h3>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-end">
        <button
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Retour au tableau de bord
        </button>
      </div>

      <Card title="Détails de l'intervention">
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {intervention.description}
          </h2>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              intervention.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : intervention.status === "scheduled"
                ? "bg-blue-100 text-blue-800"
                : intervention.status === "completed"
                ? "bg-green-100 text-green-800"
                : intervention.status === "signedOff"
                ? "bg-purple-100 text-purple-800"
                : intervention.status === "invoiced"
                ? "bg-orange-100 text-orange-800"
                : intervention.status === "paid"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {intervention.status === "pending"
              ? "Pending"
              : intervention.status === "scheduled"
              ? "Scheduled"
              : intervention.status === "completed"
              ? "Completed"
              : intervention.status === "signedOff"
              ? "Signed Off"
              : intervention.status === "invoiced"
              ? "Invoiced"
              : intervention.status === "paid"
              ? "Paid"
              : intervention.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Agence</h3>
            <p className="text-sm">{agency.name}</p>
            <p className="text-sm">{agency.address}</p>
            <p className="text-sm">Contact: {agency.phone}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Intervenant
            </h3>
            <p className="text-sm">{contractor.companyName}</p>
            <p className="text-sm">Contact: {contractor.phone}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Date demandée
            </h3>
            <p className="text-sm">{intervention.requestedDate}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Emplacement
            </h3>
            <p className="text-sm">{intervention.location}</p>
          </div>
          {intervention.documents.length > 0 && (
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Documents
              </h3>
              <ul className="text-sm space-y-1">
                {intervention.documents.map((doc, idx) => (
                  <li key={idx} className="flex items-center">
                    <svg
                      className="h-4 w-4 mr-2 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {intervention.scheduledDate && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Date prévue
              </h3>
              <p className="text-sm">{intervention.scheduledDate}</p>
            </div>
          )}
          {intervention.scheduledTime && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Heure programmée
              </h3>
              <p className="text-sm">{intervention.scheduledTime}</p>
            </div>
          )}
          {intervention.team && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Team</h3>
              <p className="text-sm">{intervention.team}</p>
            </div>
          )}
          {intervention.comments && (
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Commentaires
              </h3>
              <p className="text-sm">{intervention.comments}</p>
            </div>
          )}
          {intervention.pv && (
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Procès-Verbal
              </h3>
              <div className="bg-gray-50 p-3 rounded text-sm">
                {intervention.pv.content}
              </div>
              {intervention.pv.attachments.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-xs font-medium text-gray-500">images</h4>
                  <ul className="text-sm space-y-1 mt-1">
                    {intervention.pv.attachments.map((attachment, idx) => (
                      <li key={idx} className="flex items-center">
                        <svg
                          className="h-4 w-4 mr-2 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {attachment}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Envoyé le{" "}
                {new Date(intervention.pv.submittedAt).toLocaleDateString()}
              </p>
            </div>
          )}
          {intervention.signature && (
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Signature
              </h3>
              <Image
                src={intervention.signature}
                alt="Signature"
                className="max-h-32 border rounded p-2"
              />
            </div>
          )}
          {intervention.invoice && (
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Facture
              </h3>
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">{intervention.invoice.fileUrl}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Envoyé le{" "}
                {new Date(intervention.invoice.sentAt).toLocaleDateString()}
                {intervention.invoice.paidAt && (
                  <>
                    {" "}
                    &bull; Payer le{" "}
                    {new Date(intervention.invoice.paidAt).toLocaleDateString()}
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Action sections based on status and user role */}
      {intervention.status === "pending" && canPerformAction("contractor") && (
        <Card title="Schedule Intervention">
          <form onSubmit={handleSchedule} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="scheduled-date"
                label="Scheduled Date"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
              />
              <Input
                id="scheduled-time"
                label="Scheduled Time"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                required
              />
              <Input
                id="team"
                label="Team Members"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="comments"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Commentaires
              </label>
              <textarea
                id="comments"
                rows={3}
                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              ></textarea>
            </div>
            <Button type="submit" isLoading={loading}>
              Planifier une intervention
            </Button>
          </form>
        </Card>
      )}

      {intervention.status === "scheduled" &&
        canPerformAction("contractor") && (
          <Card title="Complete Intervention">
            <p className="mb-4 text-gray-600">
              Marquez cette intervention comme terminée une fois que vous avez
              terminé travailler sur place
            </p>
            <Button onClick={handleComplete} isLoading={loading}>
              Marquer comme terminé
            </Button>
          </Card>
        )}

      {intervention.status === "completed" &&
        canPerformAction("contractor") && (
          <Card title="Submit Procès-Verbal">
            <form onSubmit={handlePvSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="pv-content"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Procès-Verbal informations
                </label>
                <textarea
                  id="pv-content"
                  rows={5}
                  className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={pvContent}
                  onChange={(e) => setPvContent(e.target.value)}
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Images (Optionel)
                </label>
                <input
                  type="file"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  multiple
                  onChange={handlePvAttachment}
                />
              </div>
              {pvAttachments.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Télécharger le fichier
                  </h3>
                  <ul className="text-sm space-y-1">
                    {pvAttachments.map((file, idx) => (
                      <li key={idx} className="flex items-center">
                        <svg
                          className="h-4 w-4 mr-2 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {file}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Button type="submit" isLoading={loading}>
                Envoyer le Procès-Verbal
              </Button>
            </form>
          </Card>
        )}

      {intervention.status === "completed" && canPerformAction("agency") && (
        <Card title="Sign Off Intervention">
          <p className="mb-4 text-gray-600">
            Veuillez signer pour confirmer que lintervention est terminée de
            manière satisfaisante.
          </p>
          <Button onClick={startSignature}>Signer l&apos;intervention</Button>

          {/* Signature Modal */}
          {isSignatureModalOpen && (
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                <span className="hidden sm:inline-block sm:h-screen sm:align-middle">
                  &#8203;
                </span>
                <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                          Signer le bon d&apos;intervention
                        </h3>
                        <div className="bg-gray-50 border rounded-md p-2">
                          <canvas
                            ref={signatureRef}
                            width="400"
                            height="200"
                            className="w-full border border-gray-300 touch-none"
                          ></canvas>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <Button onClick={saveSignature} className="ml-3">
                      Sauvegarder la signature
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={clearSignature}
                      className="mt-3 sm:mt-0"
                    >
                      Nettoyer
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsSignatureModalOpen(false)}
                      className="mt-3 sm:ml-0 sm:mt-0"
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {intervention.status === "signedOff" &&
        canPerformAction("contractor") && (
          <Card title="Send Invoice">
            <form onSubmit={handleInvoiceSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Télécharger la facture
                </label>
                <input
                  type="file"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={handleInvoiceFile}
                  required
                />
              </div>
              {invoiceFile && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Fichier sélectionné
                  </h3>
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 mr-2 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">{invoiceFile}</span>
                  </div>
                </div>
              )}
              <Button type="submit" isLoading={loading}>
                Envoyer la facture
              </Button>
            </form>
          </Card>
        )}

      {intervention.status === "invoiced" && canPerformAction("agency") && (
        <Card title="Confirm Payment">
          <p className="mb-4 text-gray-600">
            Veuillez cliquer sur le bouton ci-dessous pour confirmer que vous
            avez payé le facture.
          </p>
          <Button onClick={handlePaymentConfirm} isLoading={loading}>
            Confirmer le paiement
          </Button>
        </Card>
      )}
    </div>
  );
}
