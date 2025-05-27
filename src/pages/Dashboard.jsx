import React, { useEffect, useState } from "react";
import Fade from "@mui/material/Fade";
import statisticController from "../api/dataController/statistics.controller";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar, // Thêm Bar
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHospital,
  faUserMd,
  faUsers,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";

const COLORS = [
  "#2196f3",
  "#90caf9",
  "#1976d2",
  "#64b5f6",
  "#42a5f5",
  "#1565c0",
];

function Dashboard() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalDoctor, setTotalDoctor] = useState(0);
  const [totalFacility, setTotalFacility] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [revenuePerFacility, setRevenuePerFacility] = useState([]);
  const [revenuePerDoctor, setRevenuePerDoctor] = useState([]);
  const [rateAppointments, setRateAppointments] = useState([]);
  const [appointmentsPerMonth, setAppointmentsPerMonth] = useState([]);
  const facliltyId = 1;
  // Các hàm fetch nhỏ
  const fetchTotalRevenue = async () => {
    try {
      const result = await statisticController.totalRevenue();
      setTotalRevenue(result.total || 0);
    } catch (err) {
      setTotalRevenue(0);
    }
  };

  const fetchTotalDoctor = async () => {
    try {
      const result = await statisticController.totalDoctor();
      setTotalDoctor(result.total || 0);
    } catch (err) {
      setTotalDoctor(0);
    }
  };

  const fetchTotalFacility = async () => {
    try {
      const result = await statisticController.totalFacility();
      setTotalFacility(result.total || 0);
    } catch (err) {
      setTotalFacility(0);
    }
  };
  const fetchRateAppointments = async () => {
    try {
      const result = await statisticController.rateAppointments();
      setRateAppointments(result.rate || 0);
    } catch (err) {
      setRateAppointments(null);
    }
  };

  const fetchTotalUser = async () => {
    try {
      const result = await statisticController.totalUser();
      setTotalUser(result.total || 0);
    } catch (err) {
      setTotalUser(0);
    }
  };

  const fetchRevenuePerFacility = async () => {
    try {
      const result = await statisticController.revenuePerFacility();
      setRevenuePerFacility(
        Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.total)
          ? result.total
          : Array.isArray(result)
          ? result
          : []
      );
    } catch (err) {
      setRevenuePerFacility([]);
    }
  };
  const fetchAppointmentsPerMonth = async () => {
    try {
      const result = await statisticController.appointmentsPerMonth();
      setAppointmentsPerMonth(
        Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.total)
          ? result.total
          : Array.isArray(result)
          ? result
          : []
      );
    } catch (err) {
      setAppointmentsPerMonth([]);
    }
  };

  const fetchRevenuePerDoctor = async () => {
    try {
      const result = await statisticController.revenuePerDoctor();
      setRevenuePerDoctor(
        Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.total)
          ? result.total
          : Array.isArray(result)
          ? result
          : []
      );
    } catch (err) {
      setRevenuePerDoctor([]);
    }
  };

  useEffect(() => {
    fetchTotalRevenue();
    fetchTotalDoctor();
    fetchTotalFacility();
    fetchTotalUser();
    fetchRevenuePerFacility();
    fetchRevenuePerDoctor();
    fetchRateAppointments();
    fetchAppointmentsPerMonth();
  }, []);

  // Chuẩn hóa data cho BarChart
  const barData = Array.isArray(revenuePerFacility)
    ? revenuePerFacility.map((item, idx) => {
        let name =
          item.facilityName || item.facility_name || `Facility ${idx + 1}`;
        // Thay thế cụm từ bằng rút gọn
        name = name
          .replace("Phòng khám Đa khoa", "PKDK")
          .replace("Bệnh viện Đa khoa Quốc tế", "BVDKQT")
          .replace("Bệnh viện Đa khoa", "BVDK")
          .replace("Phòng khám", "PK")
          .replace("Bệnh viện", "BV");
        return {
          name,
          value: item.total || item.total_income || 0,
        };
      })
    : [];

  // Chuẩn hóa data cho PieChart tỉ lệ appointment
  const pieRateData = Array.isArray(rateAppointments)
    ? rateAppointments.map((item, idx) => ({
        name: item.status || item.label || `Status ${idx + 1}`,
        value: item.total || item.value || 0,
      }))
    : [];

  // Chuẩn hóa data cho BarChart doctor revenue
  const barDoctorData = Array.isArray(revenuePerDoctor)
    ? revenuePerDoctor.map((item, idx) => ({
        name: item.doctorName || item.doctor_name || `Doctor ${idx + 1}`,
        value: item.total || item.total_income || 0,
      }))
    : [];

  const summaryBlocks = [
    {
      label: "Facilitys",
      value: totalFacility,
      icon: faHospital,
      color: "#1976d2",
      bg: "#e3f2fd",
    },
    {
      label: "Doctors",
      value: totalDoctor,
      icon: faUserMd,
      color: "#388e3c",
      bg: "#e8f5e9",
    },
    {
      label: "Users",
      value: totalUser,
      icon: faUsers,
      color: "#fbc02d",
      bg: "#fffde7",
    },
    {
      label: "Revenue",
      value: totalRevenue,
      icon: faDollarSign,
      color: "#e53935",
      bg: "#ffebee",
    },
  ];

  return (
    <Fade in={true} timeout={700}>
      <Box
        sx={{
          p: 3,
          background: "linear-gradient(135deg, #e3f2fd 0%, #fff 100%)",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={4} color="#1976d2">
          Dashboard Overview
        </Typography>
        {/* Block trên: 4 số liệu */}
        <Grid container spacing={3} mb={3}>
          {summaryBlocks.map((block) => (
            <Grid item xs={12} md={3} key={block.label}>
              <Card
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  borderRadius: 3,
                  boxShadow: "0 4px 24px 0 rgba(33,150,243,0.10)",
                  background: block.bg,
                  minHeight: 110,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: block.color,
                    width: 56,
                    height: 56,
                    mr: 2,
                    boxShadow: "0 2px 8px 0 rgba(33,150,243,0.15)",
                  }}
                >
                  <FontAwesomeIcon icon={block.icon} size="lg" color="#fff" />
                </Avatar>
                <Box>
                  <Typography color="text.secondary" fontWeight={500}>
                    {block.label}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color={block.color}>
                    {block.value}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={3}>
          {/* Revenue Per Facility - cột dọc */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: 370,
                borderRadius: 3,
                boxShadow: "0 4px 24px 0 rgba(33,150,243,0.10)",
                background: "#fff",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  color="#1976d2"
                  gutterBottom
                >
                  Top 5 Revenue Per Facility ($)
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barData}>
                    <XAxis fontSize={12} dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#1976d2" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          {/* Appointments Per Month - biểu đồ đường */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: 370,
                borderRadius: 3,
                boxShadow: "0 4px 24px 0 rgba(33,150,243,0.10)",
                background: "#fff",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  color="#1976d2"
                  gutterBottom
                >
                  Appointments Per Month
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={appointmentsPerMonth}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#2196f3"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          {/* Hai biểu đồ ngang cùng hàng */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: 370,
                borderRadius: 3,
                boxShadow: "0 4px 24px 0 rgba(33,150,243,0.10)",
                background: "#fff",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  color="#1976d2"
                  gutterBottom
                >
                  Appointment Rate
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieRateData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {pieRateData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: 370,
                borderRadius: 3,
                boxShadow: "0 4px 24px 0 rgba(33,150,243,0.10)",
                background: "#fff",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  color="#1976d2"
                  gutterBottom
                >
                  Top 5 Revenue Per Doctor ($)
                </Typography>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={barDoctorData.sort((a, b) => b.value - a.value)}
                    layout="vertical"
                  >
                    <XAxis type="number" />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={200}
                      fontSize={12}
                    />
                    <Tooltip />
                    <Bar dataKey="value" fill="#1976d2" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
}

export default Dashboard;
