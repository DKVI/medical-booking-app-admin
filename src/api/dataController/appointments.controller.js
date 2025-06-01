import axiosInstance from "../axios.config";

const appointmentsController = {
  getAll: async () => {
    try {
      const res = await axiosInstance.get("/schedulingdetail/");
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  getById: async (id) => {
    try {
      const res = await axiosInstance.post(`/schedulingdetail/${id}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
};

export default appointmentsController;
