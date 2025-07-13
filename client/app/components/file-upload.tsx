"use client";
import * as React from "react";
import { Upload, FileText, CheckCircle, Loader2 } from "lucide-react";

const FileUploadComponent: React.FC = () => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadSuccess, setUploadSuccess] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadSuccess(false);

    // Store PDF name in localStorage
    localStorage.setItem("uploadedPdfName", file.name);

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      await fetch("http://localhost:8000/upload/pdf", {
        method: "POST",
        body: formData,
      });

      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      handleFileUpload(file);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div
        onClick={handleFileUploadButtonClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`glass glass-hover cursor-pointer rounded-2xl p-8 text-center text-white transition-all duration-300 animate-float ${
          isDragging
            ? "scale-105 border-sky-400/50 shadow-lg shadow-sky-500/25"
            : ""
        } ${
          uploadSuccess
            ? "border-emerald-400/50 shadow-lg shadow-emerald-500/25"
            : ""
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          {isUploading ? (
            <Loader2 className="w-12 h-12 animate-spin text-sky-400" />
          ) : uploadSuccess ? (
            <CheckCircle className="w-12 h-12 text-emerald-400" />
          ) : (
            <div className="relative">
              <FileText className="w-12 h-12 text-slate-300 animate-pulse-slow" />
              <Upload className="w-6 h-6 text-sky-400 absolute -top-2 -right-2" />
            </div>
          )}

          <div>
            {localStorage.getItem("uploadedPdfName") ? (
              <h1 className="text-xl font-semibold mb-2 gradient-text">
                {localStorage.getItem("uploadedPdfName")}
              </h1>
            ) : (
              <h3 className="text-xl font-semibold mb-2 gradient-text">
                {isUploading
                  ? "Processing your document..."
                  : uploadSuccess
                  ? "Ready to chat with your document!"
                  : "Drag & drop or click to select"}
              </h3>
            )}
          </div>

          {!isUploading && !uploadSuccess && (
            <div className="text-xs text-slate-400 mt-2">
              PDF files only • Max 10MB
            </div>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default FileUploadComponent;
