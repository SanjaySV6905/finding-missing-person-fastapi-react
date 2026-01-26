import React, { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";
// Derive API origin from API_BASE. If using Vite proxy (VITE_API_BASE="/api")
// we keep an empty origin so image paths like "/images/..." resolve to the frontend host.
const API_ORIGIN = API_BASE === "/api" ? "" : API_BASE.replace(/\/api\/?$/, "");

export default function SearchForm() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      setMsg("Searching...");
      const res = await axios.post(`${API_BASE}/search?top_k=5`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResults(res.data);
      setMsg("");
    } catch (err) {
      console.error(err);
      setMsg(err?.response?.data?.detail || "Error searching");
    }
  };

  return (
    <>
      <form onSubmit={submit}>
        <input type="file" onChange={(e)=>setFile(e.target.files[0])} accept="image/*" />
        <button type="submit">Search</button>
      </form>
      <div>{msg}</div>
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        {results.map(r => {
          // If backend returned an absolute URL, use it directly.
          const imgSrc =
            r.image_path && (r.image_path.startsWith("http://") || r.image_path.startsWith("https://"))
              ? r.image_path
              : `${API_ORIGIN}${r.image_path}`;

          return (
            <div key={r.id} style={{ border: "1px solid #ddd", padding: 8 }}>
              <img src={imgSrc} alt={r.name} style={{ width: 160 }} />
              <div><strong>{r.name}</strong></div>
              <div>{r.description}</div>
              <div>score: {r.score.toFixed(3)}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}