import axiosInstance from "../axios.config";

const purchaseController = {
  getAll: async () => {
    try {
      const res = await axiosInstance.get("/purchase");
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  getById: () => {},
};

export default purchaseController;
