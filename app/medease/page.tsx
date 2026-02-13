"use client";

import { useState, DragEvent, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import styles from "./medease.module.css";

type AppState = "landing" | "upload" | "processing" | "results";
type Portal = "patient" | "doctor" | "admin" | null;

interface SummaryData {
  summary: string;
  markdown_path: string;
  patient_name: string;
  date_processed: string;
}

const portalFeatures = {
  patient: {
    icon: "\u{1F9D1}\u{200D}\u{2695}\u{FE0F}",
    title: "Patient Portal Features",
    features: [
      { icon: "\u{1F4C4}", title: "EHR Summarizer", desc: "Upload medical records and get AI-powered plain-English summaries" },
      { icon: "\u{1F50D}", title: "Drug Interaction Checker", desc: "Check medication safety with real-time RxNorm database lookups" },
      { icon: "\u{1F3A4}", title: "Voice Consultations", desc: "Real-time AI voice consultations with automatic field extraction" },
      { icon: "\u{1F4AC}", title: "AI Health Chat", desc: "Ask health questions and get informative AI-assisted answers" },
      { icon: "\u{1F4C8}", title: "Health History & Trends", desc: "Track your health metrics over time with visual trend analysis" },
      { icon: "\u{1F4C5}", title: "Appointment Booking", desc: "Search for doctors and book appointments with calendar scheduling" },
    ],
  },
  doctor: {
    icon: "\u{1FA7A}",
    title: "Doctor Portal Features",
    features: [
      { icon: "\u{1F4CB}", title: "Patient Feed", desc: "Real-time updates and consultation summaries from all patients" },
      { icon: "\u{1F4DC}", title: "Patient History", desc: "Comprehensive view of patient records, prescriptions, and notes" },
      { icon: "\u{1F4C6}", title: "Calendar Management", desc: "Schedule and manage appointments with integrated calendar" },
      { icon: "\u{2699}\u{FE0F}", title: "Consultation Config", desc: "Customize voice consultation templates and extraction fields" },
      { icon: "\u{1F48A}", title: "Prescription Management", desc: "Create and manage patient prescriptions with drug checks" },
      { icon: "\u{1F4E9}", title: "Reply to Updates", desc: "Respond to patient health updates with guidance and feedback" },
    ],
  },
  admin: {
    icon: "\u{1F3E5}",
    title: "Clinic Admin Features",
    features: [
      { icon: "\u{1F464}", title: "Patient Registration", desc: "Register and manage patient profiles and demographic info" },
      { icon: "\u{1F468}\u{200D}\u{2695}\u{FE0F}", title: "Doctor Management", desc: "Manage doctor profiles, specializations, and schedules" },
      { icon: "\u{1F4B3}", title: "Billing Dashboard", desc: "Track and manage billing, payments, and financial records" },
      { icon: "\u{1F4E6}", title: "Claims Management", desc: "Submit, track, and manage insurance claims end-to-end" },
      { icon: "\u{1F6E1}\u{FE0F}", title: "Eligibility Verification", desc: "Verify patient insurance eligibility in real-time" },
      { icon: "\u{1F4CA}", title: "Analytics Dashboard", desc: "Overview of clinic operations with key metrics and charts" },
    ],
  },
};

const techStack = [
  { icon: "\u{269B}\u{FE0F}", title: "React 18", desc: "TypeScript + Vite" },
  { icon: "\u{26A1}", title: "FastAPI", desc: "Python Backend" },
  { icon: "\u{1F916}", title: "Gemini 2.5 Flash", desc: "AI Summarization" },
  { icon: "\u{1F3A4}", title: "Gemini Live", desc: "Voice Consultations" },
  { icon: "\u{1F48A}", title: "RxNorm (NLM)", desc: "Drug Interactions" },
  { icon: "\u{1F4BE}", title: "SQLite", desc: "Data Persistence" },
  { icon: "\u{1F3A8}", title: "Tailwind CSS", desc: "Styling" },
  { icon: "\u{1F4F1}", title: "WebSocket", desc: "Real-time Audio" },
];

export default function MedEasePage() {
  const router = useRouter();
  const [appState, setAppState] = useState<AppState>("landing");
  const [activePortal, setActivePortal] = useState<Portal>(null);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const validateFile = (file: File): string | null => {
    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];
    const maxSize = 25 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      return "Invalid file type. Please upload a PDF, PNG, or JPG file.";
    }
    if (file.size > maxSize) {
      return "File too large. Maximum size is 25MB.";
    }
    return null;
  };

  const handleFileUpload = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setFileName(file.name);
    setError("");
    setAppState("processing");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/medease/summarize", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to process file");
      }

      const data: SummaryData = await response.json();
      setSummaryData(data);
      setAppState("results");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while processing the file"
      );
      setAppState("upload");
    }
  }, []);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleDownload = () => {
    if (!summaryData) return;
    const blob = new Blob([summaryData.summary], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${summaryData.patient_name}_Summary_${new Date().toISOString().split("T")[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleNewUpload = () => {
    setAppState("upload");
    setSummaryData(null);
    setError("");
    setFileName("");
  };

  const handleBackToLanding = () => {
    setAppState("landing");
    setSummaryData(null);
    setError("");
    setFileName("");
  };

  return (
    <div className={styles.app}>
      <button className={styles.backButton} onClick={() => router.push("/")}>
        &larr; Back to Gallery
      </button>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.logoRow}>
            <div className={styles.logoIcon}>{"\u{1FA7A}"}</div>
            <h1 className={styles.heroTitle}>MedEase</h1>
          </div>
          <p className={styles.heroSubtitle}>
            A multi-portal healthcare platform that transforms complex medical
            records into clear summaries, checks medication safety, and conducts
            AI-powered voice consultations.
          </p>
          <div className={styles.heroBadges}>
            <span className={styles.badge}>React 18 + TypeScript</span>
            <span className={styles.badge}>FastAPI</span>
            <span className={styles.badge}>Google Gemini</span>
            <span className={styles.badge}>RxNorm</span>
            <span className={styles.badge}>WebSocket</span>
          </div>
        </div>
      </section>

      {/* Portal Selection */}
      {(appState === "landing" || appState === "upload") && (
        <div className={styles.container}>
          <section className={styles.portalSection}>
            <h2 className={styles.sectionTitle}>Three Portals, One Platform</h2>
            <p className={styles.sectionSubtitle}>
              Role-based access for patients, doctors, and clinic administrators
            </p>
            <div className={styles.portalCards}>
              <div
                className={`${styles.portalCard} ${activePortal === "patient" ? styles.portalCardActive : ""}`}
                onClick={() => setActivePortal(activePortal === "patient" ? null : "patient")}
              >
                <div className={`${styles.portalIcon} ${styles.portalIconPatient}`}>
                  {"\u{1F9D1}\u{200D}\u{2695}\u{FE0F}"}
                </div>
                <h3 className={styles.portalCardTitle}>Patient Portal</h3>
                <p className={styles.portalCardDesc}>
                  Upload documents, check medications, book appointments, and
                  consult with AI voice assistants
                </p>
              </div>
              <div
                className={`${styles.portalCard} ${activePortal === "doctor" ? styles.portalCardActive : ""}`}
                onClick={() => setActivePortal(activePortal === "doctor" ? null : "doctor")}
              >
                <div className={`${styles.portalIcon} ${styles.portalIconDoctor}`}>
                  {"\u{1FA7A}"}
                </div>
                <h3 className={styles.portalCardTitle}>Doctor Portal</h3>
                <p className={styles.portalCardDesc}>
                  Manage patient feeds, view history, schedule appointments, and
                  configure voice consultations
                </p>
              </div>
              <div
                className={`${styles.portalCard} ${activePortal === "admin" ? styles.portalCardActive : ""}`}
                onClick={() => setActivePortal(activePortal === "admin" ? null : "admin")}
              >
                <div className={`${styles.portalIcon} ${styles.portalIconAdmin}`}>
                  {"\u{1F3E5}"}
                </div>
                <h3 className={styles.portalCardTitle}>Clinic Admin</h3>
                <p className={styles.portalCardDesc}>
                  Register patients, manage doctors, handle billing, claims,
                  and insurance verification
                </p>
              </div>
            </div>

            {/* Feature Detail */}
            {activePortal && (
              <div className={styles.featureDetail} key={activePortal}>
                <div className={styles.featureDetailHeader}>
                  <span className={styles.featureDetailIcon}>
                    {portalFeatures[activePortal].icon}
                  </span>
                  <h3 className={styles.featureDetailTitle}>
                    {portalFeatures[activePortal].title}
                  </h3>
                </div>
                <div className={styles.featureGrid}>
                  {portalFeatures[activePortal].features.map((f, i) => (
                    <div className={styles.featureItem} key={i}>
                      <span className={styles.featureItemIcon}>{f.icon}</span>
                      <div className={styles.featureItemContent}>
                        <h4>{f.title}</h4>
                        <p>{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Tech Stack */}
          <section className={styles.techSection}>
            <h2 className={styles.sectionTitle}>Tech Stack</h2>
            <p className={styles.sectionSubtitle}>
              Built with a modern full-stack architecture
            </p>
            <div className={styles.techGrid}>
              {techStack.map((t, i) => (
                <div className={styles.techCard} key={i}>
                  <div className={styles.techCardIcon}>{t.icon}</div>
                  <div className={styles.techCardTitle}>{t.title}</div>
                  <div className={styles.techCardDesc}>{t.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Live Demo Section */}
          <section className={styles.demoSection}>
            <div className={styles.demoCard}>
              <div className={styles.demoHeader}>
                <h2 className={styles.demoTitle}>
                  {appState === "upload" ? "EHR Summarizer Demo" : "Try the EHR Summarizer"}
                </h2>
                <p className={styles.demoSubtitle}>
                  Upload a medical document and get an AI-generated plain-English summary
                </p>
              </div>

              {error && (
                <div className={styles.errorMessage}>
                  <span className={styles.errorIcon}>!</span>
                  {error}
                </div>
              )}

              {appState === "landing" && (
                <div style={{ textAlign: "center" }}>
                  <button
                    className={styles.uploadButton}
                    onClick={() => setAppState("upload")}
                  >
                    Try Live Demo
                  </button>
                </div>
              )}

              {appState === "upload" && (
                <div
                  className={`${styles.uploadArea} ${dragActive ? styles.dragActive : ""}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className={styles.uploadIcon}>{"\u{1F4C4}"}</div>
                  <h3 className={styles.uploadAreaTitle}>
                    Drop your medical document here
                  </h3>
                  <p className={styles.uploadAreaText}>or</p>
                  <label htmlFor="medease-file-input" className={styles.uploadButton}>
                    Choose File
                  </label>
                  <input
                    id="medease-file-input"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileInput}
                    style={{ display: "none" }}
                  />
                  <p className={styles.uploadHint}>
                    Supports PDF, PNG, JPG (max 25MB)
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* Processing State */}
      {appState === "processing" && (
        <div className={styles.container}>
          <section className={styles.demoSection}>
            <div className={styles.demoCard}>
              <div className={styles.processingContainer}>
                <div className={styles.spinner} />
                <h2 className={styles.processingTitle}>
                  Analyzing {fileName}...
                </h2>
                <p className={styles.processingSubtitle}>
                  This usually takes 10-20 seconds
                </p>
                <div className={styles.processingSteps}>
                  <div className={styles.step}>Reading document</div>
                  <div className={`${styles.step} ${styles.stepActive}`}>
                    Analyzing medical content
                  </div>
                  <div className={styles.step}>Generating summary</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Results State */}
      {appState === "results" && summaryData && (
        <div className={styles.container}>
          <section className={styles.demoSection}>
            <div className={styles.demoCard}>
              <div className={styles.resultsContainer}>
                <div className={styles.resultsHeader}>
                  <div>
                    <h2 className={styles.resultsTitle}>
                      Summary for {summaryData.patient_name}
                    </h2>
                    <p className={styles.date}>
                      Generated on{" "}
                      {new Date(summaryData.date_processed).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                  <div className={styles.resultsActions}>
                    <button
                      onClick={handleBackToLanding}
                      className={`${styles.actionButton} ${styles.actionSecondary}`}
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNewUpload}
                      className={`${styles.actionButton} ${styles.actionSecondary}`}
                    >
                      New Upload
                    </button>
                    <button
                      onClick={() => window.print()}
                      className={`${styles.actionButton} ${styles.actionSecondary}`}
                    >
                      Print
                    </button>
                    <button
                      onClick={handleDownload}
                      className={`${styles.actionButton} ${styles.actionPrimary}`}
                    >
                      Download
                    </button>
                  </div>
                </div>

                <div className={styles.disclaimer}>
                  <strong>Medical Disclaimer:</strong> This summary is
                  AI-generated and for informational purposes only. It is NOT
                  medical advice. Always consult with your healthcare provider.
                </div>

                <div className={styles.summaryContent}>
                  <ReactMarkdown>{summaryData.summary}</ReactMarkdown>
                </div>

                <div className={styles.resultsFooter}>
                  <button
                    onClick={handleNewUpload}
                    className={styles.uploadAnotherButton}
                  >
                    Upload Another Document
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.footerText}>
            MedEase - AI-Powered Healthcare Platform
          </p>
          <a
            href="https://github.com/harineek24/medEase"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            View on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
