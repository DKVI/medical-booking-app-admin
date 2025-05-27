import axiosInstance from "../axios.config";

const facililtyController = {
  getAll: async () => {
    try {
      const res = await axiosInstance.get("/facility/");
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  create: async (body) => {
    try {
      const res = await axiosInstance.post("/facility/", body);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  updateById: async (body) => {
    try {
      const { id } = body;
      const res = await axiosInstance.put(`/facility/${id}`, body);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  deleteById: async (id) => {
    try {
      await axiosInstance.delete(`/facility/${id}`);
    } catch (err) {
      throw err;
    }
  },
};

export default facililtyController;
