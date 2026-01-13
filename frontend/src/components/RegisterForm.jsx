import React, { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please choose an image");
      return;
    }
    const fd = new FormData();
    fd.append("name", name);
    fd.append("description", description);
    fd.append("file", file);

    try {
      const res = await axios.post(`${API_BASE}/missing`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Registered: " + res.data.name);
      setName("");
      setDescription("");
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.detail || "Error");
    }
  };

  return (
    <form onSubmit={submit}>
      <div><input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" required/></div>
      <div><input value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description"/></div>
      <div><input type="file" onChange={(e)=>setFile(e.target.files[0])} accept="image/*" /></div>
      <div><button type="submit">Register</button></div>
      <div>{message}</div>
    </form>
  );
}
