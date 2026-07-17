"use client";
import { useState } from "react";

export default function TestUploadPage() {
  const [status, setStatus] = useState("Idle");
  const [result, setResult] = useState("");
  const [preview, setPreview] = useState("");
  const [fileInfo, setFileInfo] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show file details BEFORE upload (helps diagnose MIME type issues)
    setFileInfo(`Name: ${file.name} | Type: "${file.type || "(empty)"}" | Size: ${(file.size / 1024).toFixed(1)}KB`);
    setStatus("Uploading...");
    setResult("");
    setPreview("");

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
        credentials: "include"
      });

      setStatus(`Response status: ${res.status} ${res.ok ? "✅ OK" : "❌ FAILED"}`);
      const text = await res.text();
      setResult(text);

      if (res.ok) {
        const data = JSON.parse(text);
        setPreview(data.url);
      }
    } catch (err: any) {
      setStatus("Network Error ❌");
      setResult(err.message || String(err));
    }
  }

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Upload Diagnostic Page</h1>
      <p>Tests the backend uploader directly. No file type restriction — accepts anything.</p>

      <div style={{ margin: "20px 0", padding: "20px", border: "2px solid #0b1221", borderRadius: "8px", background: "#f8f9fa" }}>
        <label style={{ display: "block", fontWeight: "bold", marginBottom: "10px" }}>Select any image file:</label>
        <input type="file" onChange={handleUpload} style={{ display: "block", marginBottom: "10px" }} />
        <small style={{ color: "#666" }}>No accept filter — browser sends whatever file you choose.</small>
      </div>

      {fileInfo && (
        <div style={{ margin: "10px 0", padding: "10px", background: "#e8f4fd", border: "1px solid #93c5fd", borderRadius: "6px" }}>
          <strong>📁 File Info:</strong> {fileInfo}
        </div>
      )}

      <div style={{ margin: "20px 0", padding: "10px", background: status.includes("✅") ? "#d1fae5" : status.includes("❌") ? "#fee2e2" : "#f3f4f6", borderRadius: "6px" }}>
        <strong>Status:</strong> {status}
      </div>

      {result && (
        <div style={{ margin: "20px 0" }}>
          <strong>Server Response:</strong>
          <pre style={{ background: "#f4f4f4", padding: "10px", borderRadius: "4px", overflowX: "auto" }}>
            {result}
          </pre>
        </div>
      )}

      {preview && (
        <div style={{ margin: "20px 0" }}>
          <strong>Uploaded Image Preview:</strong>
          <div style={{ marginTop: "10px" }}>
            <img src={preview} alt="Uploaded" style={{ maxWidth: "100%", maxHeight: "300px", border: "1px solid #ddd" }} />
          </div>
        </div>
      )}
    </div>
  );
}
