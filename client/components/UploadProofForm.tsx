"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";

interface UploadProofFormProps {
  wagerId: string;
  counterAddress: string;
  onSuccess?: () => void;
}

export default function UploadProofForm({
  wagerId,
  counterAddress,
  onSuccess,
}: UploadProofFormProps) {
  const { address } = useAccount();
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!text.trim() && !file) {
      toast.error("Please provide a message or upload an image");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("wagerId", wagerId);
      formData.append("uploaderAddr", address);
      formData.append("notifiedUserAddr", counterAddress);
      formData.append("text", text);
      
      if (file) {
        formData.append("proof", file);
      }

      const response = await fetch("/api/upload-proof", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload proof");
      }

      toast.success("Proof uploaded successfully!");
      setText("");
      setFile(null);
      onSuccess?.();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload proof");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-surface-elevated rounded-lg p-3 space-y-3">
        <textarea
          placeholder="Add a descriptive message..."
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-surface border-border rounded-md p-2 text-sm text-foreground placeholder:text-text-subtle focus:ring-primary focus:border-primary resize-none"
        />
        <div className="flex items-center gap-3">
          <label htmlFor="proof-file" className="text-foreground text-sm font-medium">
            Proof Image
          </label>
          <input
            id="proof-file"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="text-foreground text-sm flex-1"
          />
        </div>
        {file && (
          <p className="text-xs text-text-muted">
            Selected: {file.name}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={isUploading || (!text.trim() && !file)}
        className="w-full flex items-center justify-center gap-2 rounded-lg h-11 px-4 bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? (
          <>
            <span className="material-symbols-outlined animate-spin text-xl">
              progress_activity
            </span>
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-xl">upload</span>
            <span>Upload Proof</span>
          </>
        )}
      </button>
    </form>
  );
}
