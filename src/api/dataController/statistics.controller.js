import axiosInstance from "../axios.config";

const statisticController = {
  totalRevenue: async () => {
    try {
      const res = await axiosInstance.get("/statistics/total_revenue");
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  totalDoctor: async () => {
    try {
      const res = await axiosInstance.get(`/statistics/total_doctor/`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  totalFacility: async () => {
    try {
      const res = await axiosInstance.get("/statistics/total_facility");
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  totalUser: async () => {
    try {
      const res = await axiosInstance.get("/statistics/total_user");
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  revenuePerDoctor: async () => {
    try {
      const res = await axiosInstance.get(`/statistics/revenue_per_doctor`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  revenuePerFacility: async () => {
    try {
      const res = await axiosInstance.get("/statistics/revenue_per_facility");
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  rateAppointments: async () => {
    try {
      const res = await axiosInstance.get("/statistics/rate_appointments");
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  appointmentsPerMonth: async () => {
    try {
      const res = await axiosInstance.get("/statistics/appointments_per_month");
      return res.data;
    } catch (err) {
      throw err;
    }
  },
};

export default statisticController;
