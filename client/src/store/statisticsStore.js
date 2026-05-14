import { create } from "zustand";
import api from "../services/api";

export const useStatisticsStore = create((set) => ({
  loadingStatistics: false,
  flows: 0,
  users: 0,
  communityPosts: 0,
  likes: 0,

  fetchAllStatistics: async () => {
    set({ loadingStatistics: true });
    try {
      const [flowsRes, usersRes, postsRes, likesRes] = await Promise.all([
        api.get("/flow"),
        api.get("/usuario"),
        api.get("/postagemcomunidade"),
        api.get("/curtidas"),
      ]);

      set({
        flows: flowsRes.data.length,
        users: usersRes.data.length,
        communityPosts: postsRes.data.length,
        likes: Array.isArray(likesRes.data) ? likesRes.data.length : 0,
      });
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      set({ flows: 0, users: 0, communityPosts: 0, likes: 0 });
    } finally {
      set({ loadingStatistics: false });
    }
  },
}));
