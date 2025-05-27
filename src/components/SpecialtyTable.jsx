import * as React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import { useEffect, useState } from "react";
import specialty from "../api/dataController/specialty.controller";
import SpecialtyForm from "./SpecialtyForm";
import AlertDialog from "./AlertDialog";

export default function SpecialtyTable() {
  const [status, setStatus] = useState("create");
  const [specialties, setSpecialties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const recordsPerPage = 5; // Số records mỗi trang
  const [diaglog, setDialog] = useState(false);
  const [currentSpecialty, setCurrentSpecialty] = useState({
    id: "",
    name: "",
  });

  const handleDelete = () => {
    specialty
      .deleteSpecialty(currentSpecialty.id)
      .then(() => {
        alert("Deleted Specialty id " + currentSpecialty.id);
      })
      .catch((err) => {
        alert("Error deleting specialty: " + err.message);
      });
  };

  useEffect(() => {
    specialty.getAllSpecialties().then((res) => {
      console.log(res);
      setSpecialties(res);
    });
  }, []);

  // Tính toán dữ liệu hiển thị cho trang hiện tại
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = specialties.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  // Tính tổng số trang
  const totalPages = Math.ceil(specialties.length / recordsPerPage);

  // Hàm chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const addValue = (id, name) => {
    setCurrentSpecialty({ id, name });
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Typography
          level="body-sm"
          sx={{ textAlign: "center", pb: 2 }}
        ></Typography>
        <Sheet
          variant="outlined"
          sx={(theme) => ({
            "--TableCell-height": "40px",
            "--TableHeader-height": "calc(1 * var(--TableCell-height))",
            "--Table-firstColumnWidth": "80px",
            "--Table-lastColumnWidth": "144px",
            "--TableRow-stripeBackground": "rgba(0 0 0 / 0.04)",
            "--TableRow-hoverBackground": "rgba(0 0 0 / 0.08)",
            overflow: "auto",
            backgroundColor: "background.surface",
          })}
        >
          <Table
            borderAxis="bothBetween"
            stripe="odd"
            hoverRow
            sx={{
              "& tr > *:first-child": {
                position: "sticky",
                left: 0,
                boxShadow: "1px 0 var(--TableCell-borderColor)",
                bgcolor: "background.surface",
              },
              "& tr > *:last-child": {
                position: "sticky",
                right: 0,
                bgcolor: "var(--TableCell-headBackground)",
              },
            }}
          >
            <thead>
              <tr>
                <th style={{ width: "var(--Table-firstColumnWidth)" }}>Id</th>
                <th style={{ width: 200 }}>Name</th>
                <th style={{ width: 200 }}>Doctors</th>
                <th
                  aria-label="last"
                  style={{ width: "var(--Table-lastColumnWidth)" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => {
                    setStatus("modify");
                    addValue(row.id, row.name);
                  }}
                >
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.name}</td>
                  <td>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="sm"
                        variant="plain"
                        color="primary"
                        onClick={() => {
                          addValue(row.id, row.name);
                          setStatus("modify");
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="soft"
                        color="danger"
                        onClick={() => {
                          handleDelete(row.id);
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Sheet>
        {/* Phân trang */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            size="sm"
            variant="outlined"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Typography sx={{ mx: 2, lineHeight: "32px" }}>
            Page {currentPage} of {totalPages}
          </Typography>
          <Button
            size="sm"
            variant="outlined"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </Box>
      </Box>
      <div>
        <Button
          size="sm"
          variant="solid"
          onClick={() => {
            setStatus("create");
            addValue("", "");
          }}
        >
          Add new specialty
        </Button>
      </div>
      <div className="pt-8">
        {status == "create" ? (
          <SpecialtyForm status={status} body={{ id: 0, name: "" }} />
        ) : (
          <SpecialtyForm status={status} body={currentSpecialty} />
        )}
      </div>
      <AlertDialog
        status={diaglog}
        id={currentSpecialty.id}
        functionCallback={handleDelete}
      />
    </>
  );
}
