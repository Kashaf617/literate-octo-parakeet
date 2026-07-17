"use client";
import { useState } from "react";

export default function TestUploadPage() {
  const [status, setStatus] = useState("Idle");
  const [result, setResult] = useState("");
  const [preview, setPreview] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

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

      setStatus(`Response status: ${res.status}`);
      const text = await res.text();
      setResult(text);

      if (res.ok) {
        const data = JSON.parse(text);
        setPreview(data.url);
      }
    } catch (err: any) {
      setStatus("Error");
      setResult(err.message || String(err));
    }
  }

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Uploader Diagnostic Page</h1>
      <p>This page tests the backend uploader directly.</p>
      
      <div style={{ margin: "20px 0", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
        <input type="file" accept="image/*" onChange={handleUpload} />
      </div>

      <div style={{ margin: "20px 0" }}>
        <strong>Status:</strong> {status}
      </div>

      {result && (
        <div style={{ margin: "20px 0" }}>
          <strong>Result Payload:</strong>
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
