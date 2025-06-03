import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Autocomplete,
  Avatar,
  Box,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import doctorsController from "../api/dataController/doctors.controller";
import specialtyController from "../api/dataController/specialty.controller";
import facililtyController from "../api/dataController/facility.controller";
import baseAPI from "../api/dataController/baseAPI";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import uploadController from "../api/dataController/upload.controller";
import uploadAvatar from "../api/dataController/upload.controller";
import { motion } from "framer-motion";

const Doctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [filterFacility, setFilterFacility] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("");
  const [filterName, setFilterName] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editData, setEditData] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const doctorRes = await doctorsController.getAll();
      setDoctors(doctorRes.doctors || []);
      const specialtyRes = await specialtyController.getAllSpecialties();
      setSpecialties(specialtyRes.specialties || []);
      const facilityRes = await facililtyController.getAll();
      setFacilities(facilityRes.facilities || []);
    };
    fetchData();
  }, []);

  // Lọc doctor theo filter
  const filteredDoctors = doctors.filter((doc) => {
    const matchFacility = filterFacility
      ? doc.facility === filterFacility
      : true;
    const matchSpecialty = filterSpecialty
      ? doc.specialty === filterSpecialty
      : true;
    const matchName = filterName
      ? doc.fullname?.toLowerCase().includes(filterName.toLowerCase())
      : true;
    return matchFacility && matchSpecialty && matchName;
  });

  // Khi bấm update
  const handleEdit = () => {
    setEditData(selectedDoctor);
    setEditMode(true);
  };

  // Khi bấm save update
  const handleSave = async () => {
    setLoading(true);
    try {
      let avatarUrl = editData.avatar;
      console.log(imageFile);
      // Nếu có file ảnh mới, upload trước
      if (imageFile) {
        const uploadRes = await uploadAvatar(imageFile);
        avatarUrl = uploadRes?.url || avatarUrl;

        // Gọi API đổi avatar
        await doctorsController.changeAvt({
          id: editData.id,
          avatar: avatarUrl,
        });
      }

      // Cập nhật thông tin doctor
      await doctorsController.updateFullInfo(editData.doctorId, {
        fullname: editData.fullname,
        email: editData.email,
        phone_no: editData.phone_no,
        identity_no: editData.identity_no,
        gender: editData.gender,
        id: editData.id,
        facilityId: editData.facility_id,
        specialtyId: editData.specialty_id,
        username: editData.username,
        dob: new Date(editData.dob).toISOString().split("T")[0],
        avatar: avatarUrl,
      });

      setDoctors((prev) =>
        prev.map((d) =>
          d.id === editData.id ? { ...editData, avatar: avatarUrl } : d
        )
      );
      setSelectedDoctor({ ...editData, avatar: avatarUrl });
      setSnackbar({
        open: true,
        message: "Cập nhật thành công!",
        severity: "success",
      });
      setTimeout(() => {
        setEditMode(false);
        setLoading(false);
        setImageFile(null);
      }, 1000);
    } catch (err) {
      setLoading(false);
      setSnackbar({
        open: true,
        message: "Cập nhật thất bại, vui lòng thử lại!",
        severity: "error",
      });
    }
  };

  // Khi bấm delete
  const handleDelete = async () => {
    // Gọi API xóa ở đây, ví dụ:
    // await doctorsController.delete(selectedDoctor.id);
    setDoctors((prev) => prev.filter((d) => d.id !== selectedDoctor.id));
    setSelectedDoctor(null);
    setDeleteDialog(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{ p: { xs: 1, md: 3 }, background: "#f5f7fa", minHeight: "100vh" }}
      >
        <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
          Doctors
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Autocomplete
              options={facilities.map((f) => f.name)}
              value={filterFacility}
              onChange={(_, newValue) => setFilterFacility(newValue || "")}
              renderInput={(params) => (
                <TextField {...params} label="Facility" variant="outlined" />
              )}
              isOptionEqualToValue={(option, value) => option === value}
              clearOnEscape
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              options={specialties.map((s) => s.name)}
              value={filterSpecialty}
              onChange={(_, newValue) => setFilterSpecialty(newValue || "")}
              renderInput={(params) => (
                <TextField {...params} label="Specialty" variant="outlined" />
              )}
              isOptionEqualToValue={(option, value) => option === value}
              clearOnEscape
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Doctor Name"
              variant="outlined"
              fullWidth
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Search by name"
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          {filteredDoctors.length === 0 ? (
            <Grid item xs={12}>
              <Typography color="text.secondary" align="center">
                No doctors found.
              </Typography>
            </Grid>
          ) : (
            filteredDoctors.map((doc, idx) => (
              <Grid item xs={12} md={4} key={doc.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                >
                  <Card
                    sx={{
                      borderRadius: 4,
                      boxShadow: 6,
                      background:
                        "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                      border: "1px solid #90caf9",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-8px) scale(1.01)",
                        boxShadow: 12,
                        borderColor: "#1976d2",
                      },
                    }}
                    onClick={() => {
                      setSelectedDoctor(doc);
                      setEditMode(false);
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          src={baseAPI + (doc.avatar || "")}
                          alt={doc.fullname}
                          sx={{
                            width: 64,
                            height: 64,
                            border: "2px solid #1976d2",
                            background: "#fff",
                          }}
                        />
                        <Box>
                          <Typography
                            variant="h6"
                            fontWeight={700}
                            color="primary"
                          >
                            {doc.fullname}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <b>Phone:</b> {doc.phone_no}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <b>Email:</b> {doc.email}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <b>Facility:</b> {doc.facility}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <b>Specialty:</b> {doc.specialty}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))
          )}
        </Grid>

        {/* Dialog hiển thị thông tin chi tiết bác sĩ */}
        <Dialog
          open={!!selectedDoctor}
          onClose={() => {
            setSelectedDoctor(null);
            setEditMode(false);
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            Doctor Details
            <Box>
              {!editMode && (
                <>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<EditIcon />}
                    sx={{ mr: 1 }}
                    onClick={() => {
                      setEditData(selectedDoctor);
                      setEditMode(true);
                    }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setDeleteDialog(true)}
                  >
                    Delete
                  </Button>
                </>
              )}
              <IconButton
                onClick={() => {
                  setSelectedDoctor(null);
                  setEditMode(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedDoctor && !editMode && (
              <Box sx={{ p: 2 }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Avatar
                      src={baseAPI + (selectedDoctor.avatar || "")}
                      alt={selectedDoctor.fullname}
                      sx={{
                        width: 120,
                        height: 120,
                        border: "2px solid #1976d2",
                        background: "#fff",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Stack spacing={1}>
                      <Typography variant="h5" fontWeight={700} color="primary">
                        {selectedDoctor.fullname}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        <b>Username:</b> {selectedDoctor.username || "N/A"}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        <b>Identity Number:</b>{" "}
                        {selectedDoctor.identity_no || "N/A"}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        <b>Phone:</b> {selectedDoctor.phone_no}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        <b>Email:</b> {selectedDoctor.email}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        <b>Facility:</b> {selectedDoctor.facility}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        <b>Specialty:</b> {selectedDoctor.specialty}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        <b>Gender:</b> {selectedDoctor.gender || "N/A"}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        <b>Date of Birth:</b>{" "}
                        {selectedDoctor.dob
                          ? new Date(selectedDoctor.dob).toLocaleDateString(
                              "vi-VN"
                            )
                          : "N/A"}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Edit mode */}
            {selectedDoctor && editMode && (
              <Box sx={{ p: 2, position: "relative" }}>
                {loading && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      bgcolor: "rgba(255,255,255,0.7)",
                      zIndex: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 2,
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
                <Stack
                  alignItems="center"
                  spacing={2}
                  sx={{ opacity: loading ? 0.5 : 1 }}
                >
                  <Avatar
                    src={
                      imageFile
                        ? URL.createObjectURL(imageFile)
                        : baseAPI + (editData.avatar || "")
                    }
                    alt={editData.fullname}
                    sx={{
                      width: 90,
                      height: 90,
                      border: "2px solid #1976d2",
                      background: "#fff",
                    }}
                  />
                  <Button variant="outlined" component="label" sx={{ mb: 1 }}>
                    Chọn ảnh mới
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setImageFile(e.target.files[0]);
                        }
                      }}
                    />
                  </Button>
                  <TextField
                    label="Full Name"
                    variant="outlined"
                    value={editData.fullname || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        fullname: e.target.value,
                      }))
                    }
                    fullWidth
                  />
                  <TextField
                    label="Username"
                    variant="outlined"
                    value={editData.username || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    fullWidth
                  />
                  <TextField
                    label="Phone"
                    variant="outlined"
                    value={editData.phone_no || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        phone_no: e.target.value,
                      }))
                    }
                    fullWidth
                  />
                  <TextField
                    label="Email"
                    variant="outlined"
                    value={editData.email || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    fullWidth
                  />
                  <Autocomplete
                    options={facilities.map((f) => f.name)}
                    value={editData.facility || ""}
                    onChange={(_, newValue) =>
                      setEditData((prev) => ({
                        ...prev,
                        facility: newValue || "",
                      }))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Facility"
                        variant="outlined"
                      />
                    )}
                    isOptionEqualToValue={(option, value) => option === value}
                    clearOnEscape
                    fullWidth
                  />
                  <Autocomplete
                    options={specialties.map((s) => s.name)}
                    value={editData.specialty || ""}
                    onChange={(_, newValue) =>
                      setEditData((prev) => ({
                        ...prev,
                        specialty: newValue || "",
                      }))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Specialty"
                        variant="outlined"
                      />
                    )}
                    isOptionEqualToValue={(option, value) => option === value}
                    clearOnEscape
                    fullWidth
                  />
                  <TextField
                    label="Gender"
                    variant="outlined"
                    value={editData.gender || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    fullWidth
                  />
                  <TextField
                    label="Date of Birth"
                    type="date"
                    variant="outlined"
                    value={
                      editData.dob
                        ? editData.dob.length > 10
                          ? new Date(editData.dob).toISOString().split("T")[0]
                          : editData.dob
                        : ""
                    }
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        dob: e.target.value,
                      }))
                    }
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Identity Number"
                    variant="outlined"
                    value={editData.identity_no || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        identity_no: e.target.value,
                      }))
                    }
                    fullWidth
                  />
                </Stack>
                <DialogActions sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => setEditMode(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </Box>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog xác nhận xóa */}
        <Dialog
          open={deleteDialog}
          onClose={() => setDeleteDialog(false)}
          maxWidth="xs"
        >
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={1}>
              <DeleteIcon color="error" />
              <Typography variant="h6" color="error">
                Confirm Delete
              </Typography>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete doctor{" "}
              <b>{selectedDoctor?.fullname}</b>?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="outlined" onClick={() => setDeleteDialog(false)}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

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
};

export default Doctor;
