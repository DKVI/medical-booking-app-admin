import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Divider,
  Avatar,
  Fade,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Business,
  LocationOn,
  Phone,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import facililtyController from "../api/dataController/facility.controller";

export default function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ id: 0, name: "", address: "", phone: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
    reload: false,
  });
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    facility: null,
  });
  const [mode, setMode] = useState("add"); // "add" hoặc "update"

  // Load data
  useEffect(() => {
    getAllFacility();
  }, []);

  const getAllFacility = async () => {
    const data = await facililtyController.getAll();
    setFacilities(data.facilities);
  };
  // Mở dialog thêm/sửa
  const handleOpenDialog = (facility = null) => {
    if (facility) {
      setMode("update");
      setEditing(facility);
      setForm(facility);
    } else {
      setMode("add");
      setEditing(null);
      setForm({ id: 0, name: "", address: "", phone: "" });
    }
    setOpenDialog(true);
  };

  // Đóng dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditing(null);
    setForm({ id: 0, name: "", address: "", phone: "" });
  };

  // Hàm updateFacility (giả định thành công/thất bại)
  const updateFacility = async (facility) => {
    try {
      console.log(facility);
      await facililtyController.updateById(facility);
      return { success: true };
    } catch (err) {
      return { success: false, message: err };
    }
  };

  // Hàm thêm mới
  const handleAdd = async () => {
    if (!form.name || !form.address) return;
    try {
      const res = await facililtyController.create(form);
      setFacilities((prev) => [
        ...prev,
        res.facility || {
          ...form,
          id: res.id || Math.max(0, ...prev.map((f) => f.id)) + 1,
        },
      ]);
      setSnackbar({
        open: true,
        message: "Add facility successful!",
        severity: "success",
        reload: false,
      });
      handleCloseDialog();
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Add facility failed!",
        severity: "error",
        reload: false,
      });
    }
  };

  // Xử lý thêm/sửa
  const handleSave = async () => {
    if (!form.name || !form.address) return;
    const result = await updateFacility(form);
    if (result && result.success) {
      setFacilities((prev) =>
        prev.map((f) => (f.id === editing.id ? { ...editing, ...form } : f))
      );
      setSnackbar({
        open: true,
        message: "Update successful!",
        severity: "success",
        reload: false,
      });
      handleCloseDialog();
    } else {
      setSnackbar({
        open: true,
        message: "Update failed!",
        severity: "error",
        reload: false,
      });
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSnackbarAction = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
    if (snackbar.reload) window.location.reload();
  };

  // Xử lý xóa
  const handleDelete = (facility) => {
    setConfirmDelete({ open: true, facility });
  };

  // Hàm xác nhận xóa
  const handleConfirmDelete = async () => {
    try {
      // Sử dụng đúng hàm deleteById và truyền id trực tiếp
      await facililtyController.deleteById(confirmDelete.facility.id);
      setFacilities((prev) =>
        prev.filter((f) => f.id !== confirmDelete.facility.id)
      );
      setSnackbar({
        open: true,
        message: "Delete successful!",
        severity: "success",
        reload: false,
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Delete failed!",
        severity: "error",
        reload: false,
      });
    }
    setConfirmDelete({ open: false, facility: null });
  };

  // Hàm xử lý khi bấm nút Edit
  const handleEdit = (facility) => {
    setMode("update"); // Đổi mode thành "update" khi edit
    setEditing(facility);
    setForm(facility || { id: 0, name: "", address: "", phone: "" });
    setOpenDialog(true);
  };

  return (
    <Box
      sx={{
        p: 3,
        background: "linear-gradient(135deg, #e3f2fd 0%, #fff 100%)",
        minHeight: "100vh",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight={700} color="#1976d2">
          Facility Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            background: "#2196f3",
            fontWeight: 600,
            borderRadius: 3,
            boxShadow: "0 2px 8px 0 rgba(33,150,243,0.10)",
            px: 3,
            py: 1,
            "&:hover": { background: "#1976d2" },
          }}
          onClick={() => handleOpenDialog()}
        >
          Add Facility
        </Button>
      </Stack>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 4,
          boxShadow: "0 4px 24px 0 rgba(33,150,243,0.10)",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                background: "linear-gradient(90deg, #e3f2fd 60%, #fff 100%)",
              }}
            >
              <TableCell sx={{ fontWeight: 700, color: "#1976d2" }}>
                ID
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#1976d2" }}>
                Name
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#1976d2" }}>
                Address
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#1976d2" }}>
                Phone
              </TableCell>
              <TableCell
                sx={{ fontWeight: 700, color: "#1976d2" }}
                align="right"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {facilities.map((facility, idx) => (
              <motion.tr
                key={facility.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                style={{ background: "inherit" }}
              >
                <TableCell>{facility.id}</TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar
                      sx={{
                        bgcolor: "#2196f3",
                        width: 32,
                        height: 32,
                        fontSize: 16,
                      }}
                    >
                      <Business />
                    </Avatar>
                    <Typography fontWeight={600}>{facility.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <LocationOn sx={{ color: "#1976d2" }} fontSize="small" />
                    <Typography>{facility.address}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Phone sx={{ color: "#1976d2" }} fontSize="small" />
                    <Typography>{facility.phone}</Typography>
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(facility)}
                    sx={{
                      bgcolor: "#e3f2fd",
                      mr: 1,
                      "&:hover": { bgcolor: "#bbdefb" },
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(facility)}
                    sx={{
                      bgcolor: "#ffebee",
                      "&:hover": { bgcolor: "#ffcdd2" },
                    }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </motion.tr>
            ))}
            {facilities.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No facilities found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog thêm/sửa */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 1,
            background: "linear-gradient(135deg, #e3f2fd 0%, #fff 100%)",
            overflow: "visible", // Bỏ scroll ở dialog
          },
        }}
      >
        <DialogTitle
          sx={{ textAlign: "center", color: "#1976d2", fontWeight: 700 }}
        >
          {mode === "update" ? "Edit Facility" : "Add Facility"}
        </DialogTitle>
        <Divider sx={{ mb: 2 }} />
        <DialogContent
          sx={{
            overflow: "visible", // Bỏ scroll ở content
            pb: 0,
          }}
        >
          <Stack spacing={2} mt={1}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={openDialog ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0 }}
            >
              <TextField
                label="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                fullWidth
                required
                variant="outlined"
                sx={{ background: "#fff", borderRadius: 2 }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={openDialog ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <TextField
                label="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                fullWidth
                required
                variant="outlined"
                sx={{ background: "#fff", borderRadius: 2 }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={openDialog ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <TextField
                label="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                fullWidth
                variant="outlined"
                sx={{ background: "#fff", borderRadius: 2 }}
              />
            </motion.div>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              background: "#2196f3",
              fontWeight: 600,
              px: 4,
              borderRadius: 3,
              boxShadow: "0 2px 8px 0 rgba(33,150,243,0.10)",
              "&:hover": { background: "#1976d2" },
            }}
            onClick={mode === "update" ? handleSave : handleAdd}
          >
            {mode === "update" ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, facility: null })}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 2,
            background: "linear-gradient(135deg, #e3f2fd 0%, #fff 100%)",
            textAlign: "center",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#e53935" }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 18, mb: 2 }}>
            Are you sure you want to delete facility
            <span style={{ fontWeight: 700, color: "#1976d2" }}>
              {" "}
              {confirmDelete.facility?.name}
            </span>
            ?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            variant="contained"
            sx={{
              background: "#e53935",
              fontWeight: 600,
              px: 4,
              borderRadius: 3,
              boxShadow: "0 2px 8px 0 rgba(229,57,53,0.10)",
              "&:hover": { background: "#b71c1c" },
            }}
            onClick={handleConfirmDelete}
          >
            Yes
          </Button>
          <Button
            variant="outlined"
            sx={{
              fontWeight: 600,
              px: 4,
              borderRadius: 3,
              borderColor: "#2196f3",
              color: "#2196f3",
              "&:hover": { borderColor: "#1976d2", color: "#1976d2" },
            }}
            onClick={() => setConfirmDelete({ open: false, facility: null })}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar dialog for result */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          icon={
            snackbar.severity === "success" ? (
              <span style={{ color: "#fff" }}>✔</span>
            ) : undefined
          }
          sx={{
            width: "100%",
            fontWeight: 600,
            fontSize: 18,
            background:
              snackbar.severity === "success"
                ? "#2196f3"
                : "linear-gradient(90deg, #ffebee 60%, #fff 100%)",
            color: snackbar.severity === "success" ? "#fff" : "#e53935",
            boxShadow: "0 4px 24px 0 rgba(33,150,243,0.10)",
            borderRadius: 3,
            alignItems: "center",
          }}
          action={
            snackbar.reload && (
              <Button
                color="inherit"
                size="small"
                sx={{
                  fontWeight: 700,
                  ml: 2,
                  background: "#2196f3",
                  color: "#fff",
                  borderRadius: 2,
                  px: 2,
                  "&:hover": { background: "#1976d2" },
                }}
                onClick={handleSnackbarAction}
              >
                Reload
              </Button>
            )
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
