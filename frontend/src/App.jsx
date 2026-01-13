import React from "react";
import RegisterForm from "./components/RegisterForm";
import SearchForm from "./components/SearchForm";

export default function App() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h1>Missing Person Finder</h1>
      <section>
        <h2>Register Missing Person</h2>
        <RegisterForm />
      </section>

      <hr />

      <section>
        <h2>Search by Image</h2>
        <SearchForm />
      </section>
    </div>
  );
}
