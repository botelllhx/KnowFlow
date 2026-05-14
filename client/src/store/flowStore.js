import { create } from "zustand";
import api from "../services/api";

export const useFlowStore = create((set, get) => ({
  likedPosts: [],
  savedPosts: [],
  comments: {},
  category: "",
  searchTerm: "",
  flows: [],
  loading: false,
  modalFlows: [],
  modalSearchTerm: "",
  modalLoading: false,

  toggleLike: async (postId) => {
    try {
      const usuarioId = localStorage.getItem("usuarioId");
      if (!usuarioId) throw new Error("Usuário não autenticado");

      const { likedPosts } = get();
      if (likedPosts.includes(postId)) {
        await api.delete(`/curtidas/${usuarioId}/${postId}`);
      } else {
        await api.post("/curtidas", { flow_id: postId });
      }
      set((state) => ({
        likedPosts: state.likedPosts.includes(postId)
          ? state.likedPosts.filter((id) => id !== postId)
          : [...state.likedPosts, postId],
      }));
      get().fetchFlows();
    } catch (error) {
      console.error("Erro ao processar curtida:", error);
    }
  },

  applyTagFilter: async (tag) => {
    set({ category: tag, searchTerm: "" });
    await get().fetchFlows({ category: tag, searchTerm: "" });
  },

  toggleSave: async (postId) => {
    try {
      const usuarioId = localStorage.getItem("usuarioId");
      if (!usuarioId) throw new Error("Usuário não autenticado");

      const { savedPosts } = get();
      if (savedPosts.includes(postId)) {
        await api.delete(`/flowsalvos/${usuarioId}/${postId}`);
      } else {
        await api.post("/flowsalvos", { usuarioId, flowId: postId });
      }
      set((state) => ({
        savedPosts: state.savedPosts.includes(postId)
          ? state.savedPosts.filter((id) => id !== postId)
          : [...state.savedPosts, postId],
      }));
      get().fetchFlows();
    } catch (error) {
      console.error("Erro ao processar save:", error);
    }
  },

  addComment: async (postId, comment) => {
    try {
      const response = await api.post("/comentario", {
        mensagem: comment,
        flow_id: postId,
      });
      set((state) => ({
        comments: {
          ...state.comments,
          [postId]: [...(state.comments[postId] || []), response.data],
        },
      }));
      get().fetchFlows();
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
    }
  },

  removeComment: async (postId, commentId) => {
    try {
      await api.delete(`/comentario/${commentId}`);
      set((state) => {
        const newComments = [...(state.comments[postId] || [])].filter(
          (comment) => comment.id !== commentId
        );
        return {
          comments: {
            ...state.comments,
            [postId]: newComments,
          },
        };
      });
      get().fetchFlows();
    } catch (error) {
      console.error("Erro ao remover comentário:", error);
    }
  },

  setCategory: (categoria) => {
    set({ category: categoria });
    const { searchTerm } = get();
    get().fetchFlows({ category: categoria, searchTerm });
  },

  setSearchTerm: (termo) => {
    set({ searchTerm: termo });
    const { category } = get();
    get().fetchFlows({ searchTerm: termo, category });
  },

  setModalSearchTerm: (termo) => {
    set({ modalSearchTerm: termo });
    get().fetchModalFlows(termo);
  },

  setSearchTag: (tag) => set({ category: tag }),

  searchByTag: async (tag) => {
    const { setSearchTerm, setSearchTag } = get();
    setSearchTag("");
    setSearchTerm(tag);
  },

  fetchFlows: async (params = {}) => {
    set({ loading: true });

    const { category, searchTerm } = get();
    const queryParams = new URLSearchParams();

    const finalSearchTerm = params.searchTerm ?? searchTerm;
    const finalCategory = params.category ?? category;

    if (finalSearchTerm) queryParams.append("search", finalSearchTerm);
    if (finalCategory) queryParams.append("categoria", finalCategory);

    try {
      const flowsResponse = await api.get(`/flow?${queryParams.toString()}`);

      let curtidas = [];
      try {
        const curtidasResponse = await api.get("/curtidas");
        curtidas = Array.isArray(curtidasResponse.data)
          ? curtidasResponse.data
          : [];
      } catch {
        curtidas = [];
      }

      let saves = [];
      try {
        const savesResponse = await api.get("/flowsalvos");
        saves = Array.isArray(savesResponse.data) ? savesResponse.data : [];
      } catch {
        saves = [];
      }

      const mappedFlows = flowsResponse.data.map((flow) => {
        const likeCount = curtidas.filter(
          (curtida) => String(curtida.flow_id) === String(flow.id)
        ).length;

        const commentCount = Array.isArray(flow.comentarios)
          ? flow.comentarios.length
          : 0;

        const saveCount = saves.filter(
          (save) => String(save.flow_id) === String(flow.id)
        ).length;

        return {
          ...flow,
          stats: {
            likes: likeCount,
            comments: commentCount,
            saves: saveCount,
            views: flow.visualizacoes || 0,
          },
        };
      });

      const userLikedPosts = curtidas.map((c) => String(c.flow_id));
      const userSavedPosts = saves.map((s) => String(s.flow_id));
      set({ flows: mappedFlows, likedPosts: userLikedPosts, savedPosts: userSavedPosts });
      return mappedFlows;
    } catch (error) {
      console.error("Erro ao buscar flows:", error);
      set({ flows: [] });
      return [];
    } finally {
      set({ loading: false });
    }
  },

  fetchModalFlows: async (termo = "") => {
    set({ modalLoading: true });
    const search = termo || get().modalSearchTerm || "";
    const queryParams = new URLSearchParams();

    if (search.trim() !== "") queryParams.append("search", search);

    try {
      const response = await api.get(`/flow?${queryParams.toString()}`);
      set({ modalFlows: response.data });
    } catch (error) {
      console.error("Erro ao buscar flows no modal:", error);
      set({ modalFlows: [] });
    } finally {
      set({ modalLoading: false });
    }
  },

  resetModalSearch: () =>
    set({
      searchTerm: "",
      modalFlows: [],
    }),
}));
