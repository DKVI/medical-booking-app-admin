import axiosInstance from "../axios.config";

const specialtyController = {
  // Lấy danh sách tất cả specialties
  getAllSpecialties: async () => {
    try {
      const response = await axiosInstance.get("/specialty");
      return response.data;
    } catch (error) {
      console.error("Error fetching specialties:", error);
      throw error;
    }
  },

  // Lấy thông tin specialty theo ID
  getSpecialtyById: async (id) => {
    try {
      const response = await axiosInstance.get(`/specialty/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching specialty with ID ${id}:`, error);
      throw error;
    }
  },

  // Cập nhật specialty theo ID
  updateSpecialty: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/specialty/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating specialty with ID ${id}:`, error);
      throw error;
    }
  },
  // Thêm mới specialty
  createSpecialty: async (data) => {
    try {
      const response = await axiosInstance.post("/specialty", data);
      return response.data;
    } catch (error) {
      console.error("Error creating specialty:", error);
      throw error;
    }
  },

  // Xóa specialty theo ID
  deleteSpecialty: async (id) => {
    try {
      const response = await axiosInstance.delete(`/specialty/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting specialty with ID ${id}:`, error);
      throw error;
    }
  },
};

export default specialtyController;
