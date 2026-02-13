"use client";

import { useState, DragEvent, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import styles from "./medease.module.css";

type AppState = "upload" | "processing" | "results";

interface SummaryData {
  summary: string;
  markdown_path: string;
  patient_name: string;
  date_processed: string;
}

export default function MedEasePage() {
  const router = useRouter();
  const [appState, setAppState] = useState<AppState>("upload");
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

  return (
    <div className={styles.app}>
      <button className={styles.backButton} onClick={() => router.push("/")}>
        &larr; Back to Gallery
      </button>

      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.headerTitle}>MedEase</h1>
          <p className={styles.subtitle}>
            Transform complex medical records into clear, understandable
            summaries
          </p>
        </header>

        {error && (
          <div className={styles.errorMessage}>
            <span className={styles.errorIcon}>!</span>
            {error}
          </div>
        )}

        {appState === "upload" && (
          <div className={styles.uploadContainer}>
            <div className={styles.uploadSection}>
              <div
                className={`${styles.uploadArea} ${dragActive ? styles.dragActive : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className={styles.uploadIcon}>📄</div>
                <h2 className={styles.uploadAreaTitle}>
                  Drop your medical document here
                </h2>
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
            </div>

            <div className={styles.infoCards}>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>🔒</div>
                <h3 className={styles.infoCardTitle}>Secure & Private</h3>
                <p className={styles.infoCardText}>
                  Your medical documents are processed securely and never stored
                  permanently
                </p>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>⚡</div>
                <h3 className={styles.infoCardTitle}>Fast Processing</h3>
                <p className={styles.infoCardText}>
                  Get your summary in seconds using advanced AI technology
                </p>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>💬</div>
                <h3 className={styles.infoCardTitle}>Plain English</h3>
                <p className={styles.infoCardText}>
                  Medical jargon translated into language you can understand
                </p>
              </div>
            </div>
          </div>
        )}

        {appState === "processing" && (
          <div className={styles.processingContainer}>
            <div className={styles.spinner} />
            <h2 className={styles.processingTitle}>Analyzing {fileName}...</h2>
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
        )}

        {appState === "results" && summaryData && (
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
              <strong>Medical Disclaimer:</strong> This summary is AI-generated
              and for informational purposes only. It is NOT medical advice.
              Always consult with your healthcare provider about your medical
              conditions and treatment.
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
        )}
      </div>
    </div>
  );
}
