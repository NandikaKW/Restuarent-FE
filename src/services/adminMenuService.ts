import { api } from "./api";

export type MenuItem = {
  _id: string;
  title: string;
  description?: string;
  price: number;
  imageURL: string; // MUST match backend
};

export const adminMenuService = {
  getAllMenuItems: async (page = 1, limit = 9) => {
    const response = await api.get(`/admin/menu?page=${page}&limit=${limit}`);
    return response.data;
  },

  createMenuItem: async (data: FormData): Promise<MenuItem> => {
    const res = await api.post('/admin/menu/save', data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  deleteMenuItem: async (id: string) => {
    const res = await api.delete(`/admin/menu/${id}`);
    return res.data;
  },
  updateMenuItem: async (id: string, data: FormData) => {
  const res = await api.put(`/admin/menu/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
},

};
