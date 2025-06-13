import axiosInstance from "../axios.config";

const doctorsController = {
  getAll: async () => {
    try {
      const res = await axiosInstance.get("/doctor/");
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  getById: async (id) => {
    try {
      const res = await axiosInstance.get(`/doctor/${id}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  updateFullInfo: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/doctor/full-update/${id}`, data);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  changeAvt: async (body) => {
    try {
      const res = await axiosInstance.post("/doctor/changeAvt", body);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  getByUserId: async (id) => {
    try {
      const res = await axiosInstance.get(`/doctor/user/${id}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  changeAvt: async ({ id, avatar }) => {
    try {
      const res = await axiosInstance.post("/doctor/changeAvt", {
        id,
        avatar,
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  update: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/doctor/update-doctor/${id}`, data);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
};

export default doctorsController;
