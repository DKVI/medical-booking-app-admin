import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Stack,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  Tooltip,
  Autocomplete,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import usersController from "../api/dataController/users.controller";
import doctorController from "../api/dataController/doctors.controller";
import patientController from "../api/dataController/patients.controller";
import facilityController from "../api/dataController/facility.controller";
import specialtyController from "../api/dataController/specialty.controller";
import { motion } from "framer-motion";
import uploadController from "../api/dataController/upload.controller";
import baseURL from "../api/dataController/baseAPI";
import patientsController from "../api/dataController/patients.controller";
import doctorsController from "../api/dataController/doctors.controller";

const roles = ["admin", "doctor", "patient"];
const statuses = ["Actived", "Pending"];
// Định nghĩa lại roleColors, genderColors, statusColors
const roleColors = {
  admin: "secondary",
  doctor: "primary",
  patient: "success",
};

const genderColors = {
  male: "primary",
  female: "secondary",
  other: "default",
};

const statusColors = {
  Actived: "success",
  Pending: "warning",
  Inactive: "default",
};

// Sửa lại mảng genders để đồng bộ với dữ liệu backend (chữ thường)
const genders = ["male", "female"];

// Hàm chuẩn hóa ngày về dạng YYYY-MM-DD
const toVNDateString = (dateStr) => {
  if (!dateStr) return "";
  // Nếu đã là dạng yyyy-mm-dd thì trả về luôn
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const date = new Date(dateStr);
  // Lấy yyyy-mm-dd (không cần cộng giờ vì input type="date" đã đúng)
  return date.toISOString().slice(0, 10);
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteId, setDeleteId] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const [addData, setAddData] = useState({
    fullname: "",
    identity_no: "",
    phone_no: "",
    email: "",
    role: "admin",
    status: "Actived",
    gender: "male",
    dob: "",
    address: "",
    avatar: "",
  });
  const [addLoading, setAddLoading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  // Doctor/patient extra info
  const [facilities, setFacilities] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  // Thêm state cho filter
  const [searchName, setSearchName] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterGender, setFilterGender] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await usersController.getAll();
        const usersList = res.users || [];

        // Lấy thêm thông tin doctor và patient cho từng user
        const usersWithDetails = await Promise.all(
          usersList.map(async (user) => {
            let doctorInfo = {};
            let patientInfo = {};

            if (user.role === "doctor") {
              try {
                const docRes = await doctorController.getByUserId(user.id);
                doctorInfo = docRes?.doctor || {};
              } catch {}
            }
            if (user.role === "patient") {
              try {
                const patRes = await patientController.getByUserId(user.id);
                patientInfo = patRes?.patient || {};
              } catch {}
            }

            return {
              ...user,
              ...doctorInfo,
              ...patientInfo,
            };
          })
        );

        setUsers(usersWithDetails);
      } catch {
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    // fetch facilities and specialties for doctor fields
    const fetchData = async () => {
      const [fac, spec] = await Promise.all([
        facilityController.getAll?.() ?? [],
        specialtyController.getAllSpecialties?.() ?? [],
      ]);
      setFacilities(fac.facilities || []);
      setSpecialties(spec.specialties || []);
    };
    fetchData();
  }, []);

  const handleEdit = (user) => {
    setSelected(user);
    setEditData({
      ...user,
      gender: user.gender ? user.gender.toLowerCase() : "",
    });
    setEditMode(true);
  };

  const handleSave = async () => {
    const dataToSend = {
      ...editData,
      dob: editData.dob ? toVNDateString(editData.dob) : "",
    };
    if (!dataToSend.password) {
      delete dataToSend.password; // Không gửi password nếu không đổi
    }
    try {
      console.log(dataToSend);
      await usersController.update(dataToSend.id, dataToSend);

      // Update doctor/patient info if needed
      if (editData.role === "doctor") {
        await doctorController.update(editData.id, {
          facility_id: editData.facility_id,
          specialty_id: editData.specialty_id,
        });
      } else if (editData.role === "patient") {
        await patientController.update(editData.id, {
          insurance_no: editData.insurance_no,
          weight: editData.weight,
          height: editData.height,
        });
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === dataToSend.id ? { ...dataToSend } : u))
      );
      setSnackbar({
        open: true,
        message: "Update successful!",
        severity: "success",
      });
      setEditMode(false);
      setSelected(null);
    } catch {
      setSnackbar({
        open: true,
        message: "Update failed!",
        severity: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await usersController.delete(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setSnackbar({
        open: true,
        message: "Delete successful!",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Delete failed!",
        severity: "error",
      });
    }
    setDeleteId(null);
  };

  // Thêm người dùng mới (không phải doctor/patient)
  const handleAddUser = async () => {
    setAddLoading(true);
    try {
      const res = await usersController.create(addData);
      setUsers((prev) => [...prev, res.user]);
      setSnackbar({
        open: true,
        message: "User created!",
        severity: "success",
      });
      setAddMode(false);
      setAddData({
        fullname: "",
        identity_no: "",
        phone_no: "",
        email: "",
        role: "admin",
        status: "Actived",
        gender: "male",
        dob: "",
        address: "",
        avatar: "",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Create failed!",
        severity: "error",
      });
    }
    setAddLoading(false);
  };

  // Filtered users (không phân biệt hoa thường gender)
  const filteredUsers = users.filter((u) => {
    const matchName = u.fullname
      ?.toLowerCase()
      .includes(searchName.toLowerCase());
    const matchRole = filterRole ? u.role === filterRole : true;
    const matchGender = filterGender
      ? (u.gender || "").toLowerCase() === filterGender.toLowerCase()
      : true;
    return matchName && matchRole && matchGender;
  });

  // Khi chọn file avatar mới trong form update
  const handleChooseAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewAvatar(URL.createObjectURL(file));
  };

  // Khi nhấn Save mới upload avatar
  const handleSaveAvatar = async () => {
    if (!selectedFile) return;
    setLoadingAvatar(true);
    try {
      // 1. Upload file avatar (dùng chung cho mọi role)
      const uploadRes = await patientsController.uploadAvatar(selectedFile);
      const avatarUrl = uploadRes.avatarUrl || uploadRes.avatar; // tuỳ backend trả về

      // 2. Đổi avatar theo role
      if (editData.role === "doctor") {
        await doctorsController.changeAvt({
          id: editData.user_id,
          avatar: avatarUrl,
        });
      } else {
        // admin và patient dùng chung
        await patientsController.changeAvt({
          id: editData.user_id,
          avatar: avatarUrl,
        });
      }

      setEditData((prev) => ({
        ...prev,
        avatar: avatarUrl.startsWith("http")
          ? avatarUrl.replace(baseURL, "")
          : avatarUrl,
      }));
      setSnackbar({
        open: true,
        message: "Avatar updated successfully!",
        severity: "success",
      });
      setPreviewAvatar(null);
      setSelectedFile(null);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update avatar. Please try again.",
        severity: "error",
      });
    }
    setLoadingAvatar(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          maxWidth: 1400,
          mx: "auto",
          mt: 4,
          background: "linear-gradient(135deg, #e3f2fd 0%, #fff 100%)",
          borderRadius: 4,
          boxShadow: 8,
          p: { xs: 2, md: 4 },
        }}
      >
        {/* Bộ lọc tìm kiếm */}
        <Box
          sx={{
            mb: 3,
            background: "#fff",
            borderRadius: 3,
            boxShadow: "0 2px 12px 0 rgba(31, 38, 135, 0.08)",
            p: 2,
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="center"
          >
            <TextField
              label="Search by name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              size="small"
              sx={{
                flex: 1,
                minWidth: 0,
                background: "#f7fafd",
                borderRadius: 2,
              }}
              InputProps={{
                style: { fontWeight: 500 },
              }}
            />
            <TextField
              select
              label="Role"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              size="small"
              sx={{
                flex: 1,
                minWidth: 0,
                background: "#f7fafd",
                borderRadius: 2,
              }}
              InputProps={{
                style: { fontWeight: 500 },
              }}
            >
              <MenuItem value="">All</MenuItem>
              {roles.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Gender"
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              size="small"
              sx={{
                flex: 1,
                minWidth: 0,
                background: "#f7fafd",
                borderRadius: 2,
              }}
              InputProps={{
                style: { fontWeight: 500 },
              }}
            >
              <MenuItem value="">All</MenuItem>
              {genders.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Box>
        <Stack direction="row" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setAddMode(true)}
            sx={{ fontWeight: 700, borderRadius: 2 }}
          >
            Add New User
          </Button>
        </Stack>
        <Typography
          variant="h3"
          fontWeight={900}
          color="primary"
          gutterBottom
          sx={{
            textAlign: "center",
            letterSpacing: 2,
            mb: 4,
            textShadow: "0 2px 16px #90caf9",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          User Management
        </Typography>
        <Grid container spacing={4}>
          {filteredUsers.length === 0 ? (
            <Grid item xs={12}>
              <Typography color="text.secondary" align="center">
                No users found.
              </Typography>
            </Grid>
          ) : (
            filteredUsers.map((u, idx) => (
              <Grid item xs={12} md={4} key={u.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.07 }}
                >
                  <Card
                    sx={{
                      borderRadius: 5,
                      boxShadow: 10,
                      background:
                        "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                      border: "1.5px solid #90caf9",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-10px) scale(1.03)",
                        boxShadow: 16,
                        borderColor: "#1976d2",
                      },
                      minHeight: 420,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <CardContent>
                      <Stack alignItems="center" spacing={1}>
                        <Avatar
                          src={baseURL + u.avatar}
                          alt={u.fullname}
                          sx={{
                            width: 90,
                            height: 90,
                            border: "3px solid #1976d2",
                            background: "#fff",
                            mb: 1,
                            boxShadow: 4,
                          }}
                        />
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          color="primary"
                          sx={{
                            textAlign: "center",
                            fontFamily: "Montserrat, sans-serif",
                            letterSpacing: 1,
                          }}
                        >
                          {u.fullname}
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ mt: 1, mb: 1 }}
                        >
                          <Chip
                            label={u.role}
                            color={roleColors[u.role] || "default"}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              fontSize: 13,
                              letterSpacing: 1,
                              px: 0.5,
                              textTransform: "capitalize",
                            }}
                          />
                          <Chip
                            label={u.status}
                            color={statusColors[u.status] || "default"}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              fontSize: 13,
                              px: 0.5,
                              letterSpacing: 1,
                              textTransform: "capitalize",
                            }}
                          />
                          <Chip
                            label={u.gender}
                            color={
                              genderColors[u.gender?.toLowerCase()] || "default"
                            }
                            size="small"
                            sx={{
                              fontWeight: 700,
                              fontSize: 13,
                              px: 0.5,
                              letterSpacing: 1,
                              textTransform: "capitalize",
                            }}
                          />
                        </Stack>
                        <Stack spacing={0.5} sx={{ width: "100%" }}>
                          <Tooltip title="Identity Number" arrow>
                            <Typography variant="body2" color="text.secondary">
                              <b>Identity No:</b> {u.identity_no}
                            </Typography>
                          </Tooltip>
                          <Tooltip title="Phone Number" arrow>
                            <Typography variant="body2" color="text.secondary">
                              <b>Phone:</b> {u.phone_no}
                            </Typography>
                          </Tooltip>
                          <Tooltip title="Email" arrow>
                            <Typography variant="body2" color="text.secondary">
                              <b>Email:</b> {u.email}
                            </Typography>
                          </Tooltip>
                          <Tooltip title="Date of Birth" arrow>
                            <Typography variant="body2" color="text.secondary">
                              <b>DOB:</b>{" "}
                              {u.dob
                                ? new Date(u.dob).toLocaleDateString("vi-VN")
                                : ""}
                            </Typography>
                          </Tooltip>
                          <Tooltip title="Address" arrow>
                            <Typography variant="body2" color="text.secondary">
                              <b>Address:</b> {u.address}
                            </Typography>
                          </Tooltip>
                        </Stack>
                      </Stack>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(u)}
                        size="large"
                        sx={{
                          bgcolor: "#e3f2fd",
                          "&:hover": { bgcolor: "#bbdefb" },
                          borderRadius: 2,
                          boxShadow: 2,
                          mr: 1,
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => setDeleteId(u.id)}
                        size="large"
                        sx={{
                          bgcolor: "#ffebee",
                          "&:hover": { bgcolor: "#ffcdd2" },
                          borderRadius: 2,
                          boxShadow: 2,
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))
          )}
        </Grid>

        {/* Delete confirm dialog */}
        <Dialog
          open={!!deleteId}
          onClose={() => setDeleteId(null)}
          maxWidth="xs"
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this user?</Typography>
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

        {/* Edit Dialog */}
        <Dialog
          open={editMode}
          onClose={() => setEditMode(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              p: 1,
              background: "linear-gradient(135deg, #e3f2fd 0%, #fff 100%)",
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, fontSize: 22 }}>
            Edit User
            <IconButton
              onClick={() => setEditMode(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1} alignItems="center">
              {/* Nút upload avatar */}
              <Avatar
                src={
                  previewAvatar
                    ? previewAvatar
                    : editData.avatar
                    ? editData.avatar.startsWith("http")
                      ? editData.avatar
                      : baseURL + editData.avatar
                    : ""
                }
                alt={editData.fullname}
                sx={{
                  width: 90,
                  height: 90,
                  border: "3px solid #1976d2",
                  background: "#fff",
                  mb: 1,
                  boxShadow: 4,
                }}
              />
              <Button variant="outlined" component="label" sx={{ mb: 1 }}>
                Upload avatar
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleChooseAvatar}
                />
              </Button>
              {previewAvatar && (
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleSaveAvatar}
                    disabled={loadingAvatar}
                  >
                    {loadingAvatar ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setPreviewAvatar(null);
                      setSelectedFile(null);
                    }}
                    disabled={loadingAvatar}
                  >
                    Cancel
                  </Button>
                </Stack>
              )}
              <TextField
                label="Username"
                value={editData.username || ""}
                disabled
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Password"
                type="password"
                value={editData.password || ""}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                fullWidth
                sx={{ mb: 2 }}
                helperText="Leave blank if you do not want to change the password"
              />
              <TextField
                label="Full Name"
                value={editData.fullname || ""}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, fullname: e.target.value }))
                }
                fullWidth
              />
              <TextField
                label="Identity No"
                value={editData.identity_no || ""}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    identity_no: e.target.value,
                  }))
                }
                fullWidth
              />
              <TextField
                label="Phone"
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
                value={editData.email || ""}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                fullWidth
              />
              <TextField
                select
                label="Role"
                value={editData.role || ""}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    role: e.target.value,
                  }))
                }
                fullWidth
                disabled // Không cho đổi role khi edit
              >
                {roles.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Status"
                value={editData.status || ""}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
                fullWidth
              >
                {statuses.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Gender"
                value={editData.gender || ""}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    gender: e.target.value,
                  }))
                }
                fullWidth
              >
                {genders.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Date of Birth"
                type="date"
                value={
                  editData.dob
                    ? editData.dob.length > 10
                      ? toVNDateString(editData.dob)
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
                label="Address"
                value={editData.address || ""}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                fullWidth
              />

              {/* Doctor fields */}
              {editData.role === "doctor" && (
                <>
                  <Autocomplete
                    options={facilities}
                    getOptionLabel={(option) => option.name || ""}
                    value={
                      facilities.find((f) => f.id === editData.facility_id) ||
                      null
                    }
                    onChange={(_, newValue) =>
                      setEditData((prev) => ({
                        ...prev,
                        facility_id: newValue ? newValue.id : "",
                      }))
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Facility" fullWidth />
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    fullWidth
                  />
                  <Autocomplete
                    options={specialties}
                    getOptionLabel={(option) => option.name || ""}
                    value={
                      specialties.find((s) => s.id === editData.specialty_id) ||
                      null
                    }
                    onChange={(_, newValue) =>
                      setEditData((prev) => ({
                        ...prev,
                        specialty_id: newValue ? newValue.id : "",
                      }))
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Specialty" fullWidth />
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    fullWidth
                  />
                </>
              )}

              {/* Patient fields */}
              {editData.role === "patient" && (
                <>
                  <TextField
                    label="Insurance No (optional)"
                    value={editData.insurance_no || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        insurance_no: e.target.value,
                      }))
                    }
                    fullWidth
                  />
                  <TextField
                    label="Weight (kg)"
                    type="number"
                    value={editData.weight || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        weight: e.target.value,
                      }))
                    }
                    fullWidth
                  />
                  <TextField
                    label="Height (cm)"
                    type="number"
                    value={editData.height || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        height: e.target.value,
                      }))
                    }
                    fullWidth
                  />
                </>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditMode(false)} color="inherit">
              Cancel
            </Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add User Dialog */}
        <Dialog
          open={addMode}
          onClose={() => setAddMode(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              p: 1,
              background: "linear-gradient(135deg, #e3f2fd 0%, #fff 100%)",
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, fontSize: 22 }}>
            Add new user
            <IconButton
              onClick={() => setAddMode(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1} alignItems="center">
              <Avatar
                src={baseURL + addData.avatar}
                alt={addData.fullname}
                sx={{
                  width: 90,
                  height: 90,
                  border: "3px solid #1976d2",
                  background: "#fff",
                  mb: 1,
                  boxShadow: 4,
                }}
              />
              <Button variant="outlined" component="label" sx={{ mb: 1 }}>
                Upload avatar
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setAddData((prev) => ({
                        ...prev,
                        avatar: URL.createObjectURL(file),
                      }));
                      try {
                        const res = await uploadController.uploadAvatar(file);
                        setAddData((prev) => ({
                          ...prev,
                          avatar: res.url,
                        }));
                      } catch {
                        setSnackbar({
                          open: true,
                          message: "Upload avatar failed!",
                          severity: "error",
                        });
                      }
                    }
                  }}
                />
              </Button>
              <TextField
                label="Full Name"
                value={addData.fullname}
                onChange={(e) =>
                  setAddData((prev) => ({ ...prev, fullname: e.target.value }))
                }
                fullWidth
              />
              <TextField
                label="Identity No"
                value={addData.identity_no}
                onChange={(e) =>
                  setAddData((prev) => ({
                    ...prev,
                    identity_no: e.target.value,
                  }))
                }
                fullWidth
              />
              <TextField
                label="Phone"
                value={addData.phone_no}
                onChange={(e) =>
                  setAddData((prev) => ({
                    ...prev,
                    phone_no: e.target.value,
                  }))
                }
                fullWidth
              />
              <TextField
                label="Email"
                value={addData.email}
                onChange={(e) =>
                  setAddData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                fullWidth
              />
              <TextField
                select
                label="Role"
                value={addData.role}
                onChange={(e) =>
                  setAddData((prev) => ({
                    ...prev,
                    role: e.target.value,
                  }))
                }
                fullWidth
              >
                <MenuItem value="doctor">doctor</MenuItem>
                <MenuItem value="admin">admin</MenuItem>
                <MenuItem value="patient">patient</MenuItem>
                {/* Không cho chọn doctor/patient ở đây */}
              </TextField>
              <TextField
                select
                label="Status"
                value={addData.status}
                onChange={(e) =>
                  setAddData((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
                fullWidth
              >
                {statuses.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Gender"
                value={addData.gender}
                onChange={(e) =>
                  setAddData((prev) => ({
                    ...prev,
                    gender: e.target.value,
                  }))
                }
                fullWidth
              >
                {genders.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Date of Birth"
                type="date"
                value={addData.dob}
                onChange={(e) =>
                  setAddData((prev) => ({
                    ...prev,
                    dob: e.target.value,
                  }))
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Address"
                value={addData.address}
                onChange={(e) =>
                  setAddData((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddMode(false)} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={handleAddUser}
              variant="contained"
              color="primary"
              disabled={addLoading}
            >
              {addLoading ? "Loading..." : "Add"}
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
};

export default Users;
