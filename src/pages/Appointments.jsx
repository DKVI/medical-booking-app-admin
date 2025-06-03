import React, { useEffect, useState } from "react";
import appointmentsController from "../api/dataController/appointments.controller";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Box,
  CardHeader,
  TextField,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Autocomplete,
  Avatar,
  Stack,
} from "@mui/material";
import specialtyController from "../api/dataController/specialty.controller";
import facililtyController from "../api/dataController/facility.controller";
import dayjs from "dayjs";
import doctorsController from "../api/dataController/doctors.controller";
import patientsController from "../api/dataController/patients.controller";
import baseAPI from "../api/dataController/baseAPI";

// Hàm chọn màu chip theo status
const getStatusColor = (status) => {
  switch (status) {
    case "Done":
      return "success"; // green
    case "Process":
      return "error"; // red
    case "Expired":
      return "warning"; // orange
    default:
      return "default";
  }
};

// Hàm format ngày
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState(null);
  const [patients, setPatients] = useState(null);
  // Filter states
  const [filterTime, setFilterTime] = useState("");
  const [filterFacility, setFilterFacility] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("");
  const [filterDoctor, setFilterDoctor] = useState("");

  // Unique facility & specialty for filter options
  const [facilityOptions, setFacilityOptions] = useState([]);
  const [specialtyOptions, setSpecialtyOptions] = useState([]);

  const getSpecialties = async () => {
    try {
      const result = await specialtyController.getAllSpecialties();
      setSpecialtyOptions(result.specialties);
    } catch (err) {
      console.log(err);
    }
  };
  const getFacilities = async () => {
    try {
      const result = await facililtyController.getAll();
      setFacilityOptions(result.facilities);
    } catch (err) {
      console.log(err);
    }
  };
  const getAppointments = async () => {
    try {
      const result = await appointmentsController.getAll();
      const data = result.schedulingDetails || [];
      setAppointments(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const getDoctors = async () => {
    try {
      const result = await doctorsController.getAll();
      const data = result.doctors || [];
      setDoctors(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const getPatients = async () => {
    try {
      const result = await patientsController.getAll();
      const data = result.patients || [];
      console.log(data);
      setPatients(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAppointments();
    getSpecialties();
    getFacilities();
    getDoctors();
    getPatients();
  }, []);

  // Lấy tháng/năm hiện tại
  const now = dayjs();
  const currentMonth = now.month(); // 0-based
  const currentYear = now.year();

  // Group appointments by month/year
  const groupedAppointments = appointments.reduce((groups, item) => {
    const date = dayjs(item.date);
    const monthYear = `${date.month() + 1}/${date.year()}`;
    if (!groups[monthYear]) groups[monthYear] = [];
    groups[monthYear].push(item);
    return groups;
  }, {});

  // Lọc và sort từng nhóm theo filter và ngày giảm dần
  Object.keys(groupedAppointments).forEach((key) => {
    groupedAppointments[key] = groupedAppointments[key]
      .filter((item) => {
        const matchTime = filterTime ? item.times.includes(filterTime) : true;
        const matchFacility = filterFacility
          ? item.facility_name === filterFacility
          : true;
        const matchSpecialty = filterSpecialty
          ? item.specialty_name === filterSpecialty
          : true;
        const matchDoctor = filterDoctor
          ? item.doctor_id === filterDoctor
          : true;
        return matchTime && matchFacility && matchSpecialty && matchDoctor;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Descending by date
  });

  // Lấy danh sách các tháng có dữ liệu, sort giảm dần theo thời gian
  const monthKeys = Object.keys(groupedAppointments)
    .filter((key) => groupedAppointments[key].length > 0)
    .sort((a, b) => {
      const [ma, ya] = a.split("/").map(Number);
      const [mb, yb] = b.split("/").map(Number);
      return yb !== ya ? yb - ya : mb - ma;
    });

  return (
    <Box
      sx={{ p: { xs: 1, md: 3 }, background: "#f5f7fa", minHeight: "100vh" }}
    >
      <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
        Appointments
      </Typography>

      {/* Filter section */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <TextField
            label="Filter by time"
            variant="outlined"
            fullWidth
            value={filterTime}
            onChange={(e) => setFilterTime(e.target.value)}
            placeholder="e.g. 10:30"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Autocomplete
            options={facilityOptions.map((f) => f.name)}
            value={filterFacility}
            onChange={(_, newValue) => setFilterFacility(newValue || "")}
            renderInput={(params) => (
              <TextField {...params} label="Facility" variant="outlined" />
            )}
            isOptionEqualToValue={(option, value) => option === value}
            clearOnEscape
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Autocomplete
            options={specialtyOptions.map((s) => s.name)}
            value={filterSpecialty}
            onChange={(_, newValue) => setFilterSpecialty(newValue || "")}
            renderInput={(params) => (
              <TextField {...params} label="Specialty" variant="outlined" />
            )}
            isOptionEqualToValue={(option, value) => option === value}
            clearOnEscape
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Autocomplete
            options={
              doctors
                ? doctors.map((d) => ({ label: d.fullname, id: d.id }))
                : []
            }
            value={
              doctors
                ? doctors
                    .map((d) => ({ label: d.fullname, id: d.id }))
                    .find((d) => d.id === filterDoctor) || null
                : null
            }
            onChange={(_, newValue) =>
              setFilterDoctor(newValue ? newValue.id : "")
            }
            renderInput={(params) => (
              <TextField {...params} label="Doctor" variant="outlined" />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            clearOnEscape
          />
        </Grid>
      </Grid>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : monthKeys.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No appointments found.
        </Typography>
      ) : (
        monthKeys.map((monthKey) => (
          <Box key={monthKey} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
              Appointments in {monthKey}
            </Typography>
            <Grid container spacing={3}>
              {groupedAppointments[monthKey].map((item) => {
                const doctor = doctors?.find((d) => d.id === item.doctor_id);

                return (
                  <Grid
                    item
                    xs={12}
                    md={6}
                    key={item.id + "_" + Math.floor(Math.random() * 1000000)}
                  >
                    <Card
                      sx={{
                        borderRadius: 4,
                        boxShadow: 8,
                        background:
                          "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                        border: "1px solid #90caf9",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-8px) scale(1.01)",
                          boxShadow: 16,
                          borderColor: "#1976d2",
                        },
                      }}
                    >
                      <CardHeader
                        sx={{ pb: 0 }}
                        title={
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: { xs: "flex-start", md: "center" },
                              flexDirection: { xs: "column", md: "row" },
                              gap: 2,
                            }}
                          >
                            {/* Doctor info only */}
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                            >
                              <Avatar
                                src={baseAPI + (doctor?.avatar || "")}
                                alt={doctor?.name || item.doctor_name}
                                sx={{
                                  width: 56,
                                  height: 56,
                                  border: "2px solid #1976d2",
                                  background: "#fff",
                                }}
                              />
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  color="text.secondary"
                                  sx={{ letterSpacing: 1 }}
                                >
                                  Doctor
                                </Typography>
                                <Typography
                                  variant="h6"
                                  fontWeight={700}
                                  color="primary"
                                >
                                  {doctor?.name || item.doctor_name}
                                </Typography>
                                <Stack
                                  direction="row"
                                  spacing={2}
                                  sx={{ mt: 0.5 }}
                                >
                                  {doctor?.phone && (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Phone: <b>{doctor.phone}</b>
                                    </Typography>
                                  )}
                                  {doctor?.email && (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Email: <b>{doctor.email}</b>
                                    </Typography>
                                  )}
                                  {doctor?.specialty && (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Specialty: <b>{doctor.specialty}</b>
                                    </Typography>
                                  )}
                                </Stack>
                              </Box>
                            </Stack>
                            {/* Status chip */}
                            <Chip
                              label={item.status}
                              color={getStatusColor(item.status)}
                              size="medium"
                              sx={{
                                fontWeight: 700,
                                fontSize: 15,
                                px: 2,
                                letterSpacing: 1,
                                textTransform: "uppercase",
                                boxShadow: 2,
                              }}
                            />
                          </Box>
                        }
                      />
                      <CardContent sx={{ pt: 2 }}>
                        {/* Appointment info */}
                        <Stack spacing={0.5}>
                          <Typography variant="body1">
                            <b style={{ color: "#1976d2" }}>Facility:</b>{" "}
                            {item.facility_name}
                          </Typography>
                          <Typography variant="body1">
                            <b style={{ color: "#1976d2" }}>Specialty:</b>{" "}
                            {item.specialty_name}
                          </Typography>
                          <Typography variant="body1">
                            <b style={{ color: "#1976d2" }}>Address:</b>{" "}
                            {item.address}
                          </Typography>
                          <Typography variant="body1">
                            <b style={{ color: "#1976d2" }}>Time:</b>{" "}
                            <span style={{ color: "green", fontWeight: 600 }}>
                              {item.times}
                            </span>
                          </Typography>
                          <Typography variant="body1">
                            <b style={{ color: "#1976d2" }}>Date:</b>{" "}
                            <span style={{ color: "green", fontWeight: 600 }}>
                              {formatDate(item.date)}
                            </span>
                          </Typography>
                          {item.note && (
                            <Typography variant="body2" color="text.secondary">
                              Note: <b>{item.note}</b>
                            </Typography>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        ))
      )}
    </Box>
  );
};

export default Appointments;
