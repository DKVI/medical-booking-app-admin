import axiosInstance from "../axios.config";

const userController = {
  getAll: async () => {
    try {
      const res = await axiosInstance.get("/user");
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  create: async (body) => {
    try {
      const res = await axiosInstance.post("/user", body);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  delete: async (id) => {
    try {
      const res = await axiosInstance.delete(`/user/${id}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  update: async (id, body) => {
    try {
      const res = await axiosInstance.put(`/user/${id}`, body);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
};

export default userController;
