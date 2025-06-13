import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  IconButton,
  Snackbar,
  Paper,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import specialtyController from "../api/dataController/specialty.controller";
import { motion } from "framer-motion";

function Specialties() {
  const [specialties, setSpecialties] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState({ id: null, name: "" });
  const [mode, setMode] = useState("add"); // "add" | "edit"
  const [deleteId, setDeleteId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch all specialties
  const fetchSpecialties = async () => {
    try {
      const res = await specialtyController.getAllSpecialties();
      setSpecialties(res.specialties || []);
    } catch (err) {
      setSpecialties([]);
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  // Open dialog for add/edit
  const handleOpenDialog = (specialty = null) => {
    if (specialty) {
      setEditData({ ...specialty });
      setMode("edit");
    } else {
      setEditData({ id: null, name: "" });
      setMode("add");
    }
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditData({ id: null, name: "" });
  };

  // Save (add or edit)
  const handleSave = async () => {
    if (!editData.name.trim()) {
      setSnackbar({
        open: true,
        message: "Name is required!",
        severity: "warning",
      });
      return;
    }
    try {
      if (mode === "add") {
        const res = await specialtyController.createSpecialty({
          name: editData.name,
        });
        setSpecialties((prev) => [
          ...prev,
          res.specialty || { id: res.id, name: editData.name },
        ]);
        setSnackbar({
          open: true,
          message: "Add specialty successful!",
          severity: "success",
        });
      } else {
        await specialtyController.updateSpecialty(editData.id, {
          name: editData.name,
        });
        setSpecialties((prev) =>
          prev.map((s) =>
            s.id === editData.id ? { ...s, name: editData.name } : s
          )
        );
        setSnackbar({
          open: true,
          message: "Update specialty successful!",
          severity: "success",
        });
      }
      handleCloseDialog();
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Operation failed!",
        severity: "error",
      });
    }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await specialtyController.deleteSpecialty(id);
      setSpecialties((prev) => prev.filter((s) => s.id !== id));
      setSnackbar({
        open: true,
        message: "Delete specialty successful!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Delete failed!",
        severity: "error",
      });
    }
    setDeleteId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          maxWidth: 700,
          mx: "auto",
          mt: 4,
          background: "linear-gradient(135deg, #e3f2fd 0%, #fff 100%)",
          borderRadius: 4,
          boxShadow: 6,
          p: { xs: 2, md: 4 },
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          color="primary"
          gutterBottom
          sx={{
            textAlign: "center",
            letterSpacing: 1,
            mb: 3,
            textShadow: "0 2px 8px #90caf9",
          }}
        >
          Specialties
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
            sx={{
              borderRadius: 3,
              fontWeight: 600,
              boxShadow: 2,
              px: 3,
              py: 1,
            }}
          >
            Add Specialty
          </Button>
        </Box>
        <Paper
          sx={{
            p: 2,
            background: "rgba(255,255,255,0.95)",
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          {specialties.length === 0 ? (
            <Typography color="text.secondary" align="center">
              No specialties found.
            </Typography>
          ) : (
            <Box
              component="table"
              sx={{
                width: "100%",
                borderCollapse: "collapse",
                background: "transparent",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{ textAlign: "left", padding: 8, fontWeight: 600 }}
                  >
                    #
                  </th>
                  <th
                    style={{ textAlign: "left", padding: 8, fontWeight: 600 }}
                  >
                    Name
                  </th>
                  <th
                    style={{ textAlign: "center", padding: 8, fontWeight: 600 }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {specialties.map((s, idx) => (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.07 }}
                    style={{
                      background: idx % 2 === 0 ? "#f5f7fa" : "#e3f2fd",
                      borderRadius: 8,
                    }}
                  >
                    <td style={{ padding: 8 }}>{idx + 1}</td>
                    <td style={{ padding: 8, fontWeight: 500 }}>{s.name}</td>
                    <td style={{ padding: 8, textAlign: "center" }}>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(s)}
                        size="small"
                        sx={{
                          bgcolor: "#e3f2fd",
                          mr: 1,
                          "&:hover": { bgcolor: "#bbdefb" },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => setDeleteId(s.id)}
                        size="small"
                        sx={{
                          bgcolor: "#ffebee",
                          "&:hover": { bgcolor: "#ffcdd2" },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </Box>
          )}
        </Paper>

        {/* Add/Edit Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>
            {mode === "add" ? "Add Specialty" : "Edit Specialty"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField
                label="Name"
                value={editData.name}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, name: e.target.value }))
                }
                fullWidth
                required
                variant="outlined"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="inherit">
              Cancel
            </Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete confirm dialog */}
        <Dialog
          open={!!deleteId}
          onClose={() => setDeleteId(null)}
          maxWidth="xs"
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this specialty?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteId(null)} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={() => handleDelete(deleteId)}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity={snackbar.severity}
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
      </Box>
    </motion.div>
  );
}

export default Specialties;
