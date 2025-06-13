import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import specialtyController from "../api/dataController/specialty.controller";
function SpecialtyForm({ status, body }) {
  const [name, setName] = useState("");
  const inputRef = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (status === "create") {
      specialtyController
        .createSpecialty(body.id, { id: body.id, name: name })
        .then(() => {
          alert(`Modifying specialty with name: ${name}`);
          setName("");
          inputRef.current.focus();
        })
        .catch(() => {
          alert("Got error, please try again!");
        });
    } else if (status === "modify") {
      specialtyController
        .updateSpecialty(body.id, { id: body.id, name: name })
        .then(() => {
          alert(`Modifying specialty with name: ${name}`);
        })
        .catch(() => {
          alert("Got error, please try again!");
        });

      setName("");
      inputRef.current.focus();
    }
  };
  useEffect(() => {
    if (body.name) {
      setName(body.name);
    }
  }, [body]);

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: "400px", margin: "0 auto", paddingTop: "80px" }}
    >
      <h2>
        {status === "create"
          ? "Create Specialty"
          : `Modify Specialty Id ${body.id}`}
      </h2>
      <div style={{ marginBottom: "16px" }}>
        <label htmlFor="name" style={{ display: "block", marginBottom: "8px" }}>
          Name:
        </label>
        {status === "create" ? (
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter specialty name"
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        ) : (
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter specialty name"
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        )}
      </div>
      <button
        type="submit"
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          color: "#fff",
          backgroundColor: status === "create" ? "#28a745" : "#007bff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {status === "create" ? "Create" : "Modify"}
      </button>
    </form>
  );
}

SpecialtyForm.propTypes = {
  status: PropTypes.oneOf(["create", "modify"]).isRequired,
};

export default SpecialtyForm;
