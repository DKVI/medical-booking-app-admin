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
  getByUserId: async (id) => {
    try {
      const res = await axiosInstance.get(`/patient/user/${id}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  update: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/patient/${id}`, data);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  // Đổi avatar bệnh nhân
  changeAvt: async ({ id, avatar }) => {
    try {
      const res = await axiosInstance.post("/patient/changeAvt", {
        id,
        avatar,
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  // Upload avatar cho patient
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await axiosInstance.post("/patient/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
};

export default patientsController;
