import React, { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

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
        {results.map(r => (
          <div key={r.id} style={{ border: "1px solid #ddd", padding: 8 }}>
            <img src={r.image_path} alt={r.name} style={{ width: 160 }} />
            <div><strong>{r.name}</strong></div>
            <div>{r.description}</div>
            <div>score: {r.score.toFixed(3)}</div>
          </div>
        ))}
      </div>
    </>
  );
}
