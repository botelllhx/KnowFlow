import { create } from "zustand";
import api from "../services/api";

export const useUserStore = create((set, get) => ({
  users: [],
  filteredUsers: [],
  loadingUsers: false,

  fetchUsers: async () => {
    set({ loadingUsers: true });
    try {
      const response = await api.get("/usuario");
      set({
        users: response.data,
        filteredUsers: response.data,
      });
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      set({ users: [], filteredUsers: [] });
    } finally {
      set({ loadingUsers: false });
    }
  },

  filterUsers: (termo) => {
    const allUsers = get().users;
    const termoLower = termo.toLowerCase();

    const filtrados = allUsers.filter(
      (user) =>
        user.nome.toLowerCase().includes(termoLower) ||
        user.email.toLowerCase().includes(termoLower)
    );

    set({ filteredUsers: filtrados });
  },

  resetFilteredUsers: () => {
    const allUsers = get().users;
    set({ filteredUsers: allUsers });
  },
}));
