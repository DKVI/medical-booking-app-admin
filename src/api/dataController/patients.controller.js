import axiosInstance from "../axios.config";

const patientsController = {
  getAll: async () => {
    try {
      const res = await axiosInstance.get("/patient/");
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  getById: async (id) => {
    try {
      const res = await axiosInstance.get(`/patient/${id}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
};

export default patientsController;
