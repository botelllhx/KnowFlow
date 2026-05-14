import { create } from "zustand";
import api from "../services/api";

export const useFiltroStore = create((set) => ({
  categorias: [],
  tags: [],
  filteredTags: [],
  loadingFilter: false,

  fetchFiltros: async () => {
    set({ loadingFilter: true });
    try {
      const response = await api.get("/filtros");
      const { categorias, tags } = response.data;
      set({
        categorias,
        tags,
        filteredTags: tags,
        loadingFilter: false,
      });
    } catch (error) {
      console.error("Erro ao buscar filtros:", error);
      set({ categorias: [], tags: [], filteredTags: [], loadingFilter: false });
    }
  },

  filterTags: (termo) => {
    set((state) => ({
      filteredTags: state.tags.filter((tag) =>
        tag.toLowerCase().includes(termo.toLowerCase())
      ),
    }));
  },

  resetFilteredTags: () => {
    set((state) => ({ filteredTags: state.tags }));
  },
}));
