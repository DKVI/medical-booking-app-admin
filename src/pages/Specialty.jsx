import React from "react";
import SpecialtyTable from "../components/SpecialtyTable";
import SpecialtyForm from "../components/SpecialtyForm";
function Specialty() {
  return (
    <div>
      <h2>Specialty</h2>
      <div className="table-container flex justify-between">
        <SpecialtyTable />
      </div>
    </div>
  );
}

export default Specialty;
