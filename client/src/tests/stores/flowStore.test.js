import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock do módulo api antes de qualquer import do store
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

import api from '../../services/api';
import { useFlowStore } from '../../store/flowStore';

describe('flowStore', () => {
  beforeEach(() => {
    // Reset store state entre testes
    useFlowStore.setState({
      flows: [],
      loading: false,
      likedPosts: [],
      savedPosts: [],
      comments: {},
      category: '',
      searchTerm: '',
    });
    vi.clearAllMocks();
  });

  describe('fetchFlows', () => {
    it('popula flows após fetch bem-sucedido', async () => {
      const mockFlows = [
        { id: '1', titulo: 'Flow A', visualizacoes: 10, comentarios: [] },
        { id: '2', titulo: 'Flow B', visualizacoes: 5, comentarios: [] },
      ];
      api.get.mockImplementation((url) => {
        if (url.startsWith('/flow')) return Promise.resolve({ data: mockFlows });
        if (url === '/curtidas') return Promise.resolve({ data: [] });
        if (url === '/flowsalvos') return Promise.resolve({ data: [] });
        return Promise.resolve({ data: [] });
      });

      await useFlowStore.getState().fetchFlows();

      const { flows, loading } = useFlowStore.getState();
      expect(flows).toHaveLength(2);
      expect(flows[0].titulo).toBe('Flow A');
      expect(loading).toBe(false);
    });

    it('define flows como [] em caso de erro na API', async () => {
      api.get.mockRejectedValue(new Error('Network error'));

      await useFlowStore.getState().fetchFlows();

      const { flows, loading } = useFlowStore.getState();
      expect(flows).toEqual([]);
      expect(loading).toBe(false);
    });

    it('enriquece flows com stats de curtidas e saves', async () => {
      const mockFlows = [{ id: 'flow-1', titulo: 'Flow X', visualizacoes: 3, comentarios: [] }];
      const mockCurtidas = [{ flow_id: 'flow-1' }, { flow_id: 'flow-1' }];
      const mockSaves = [{ flow_id: 'flow-1' }];

      api.get.mockImplementation((url) => {
        if (url.startsWith('/flow')) return Promise.resolve({ data: mockFlows });
        if (url === '/curtidas') return Promise.resolve({ data: mockCurtidas });
        if (url === '/flowsalvos') return Promise.resolve({ data: mockSaves });
        return Promise.resolve({ data: [] });
      });

      await useFlowStore.getState().fetchFlows();

      const { flows, likedPosts, savedPosts } = useFlowStore.getState();
      expect(flows[0].stats.likes).toBe(2);
      expect(flows[0].stats.saves).toBe(1);
      expect(flows[0].stats.views).toBe(3);
      expect(likedPosts).toContain('flow-1');
      expect(savedPosts).toContain('flow-1');
    });

    it('mantém loading=false mesmo se curtidas/saves falharem', async () => {
      api.get.mockImplementation((url) => {
        if (url.startsWith('/flow')) return Promise.resolve({ data: [] });
        return Promise.reject(new Error('Unauthorized'));
      });

      await useFlowStore.getState().fetchFlows();

      expect(useFlowStore.getState().loading).toBe(false);
    });
  });

  describe('setCategory', () => {
    it('atualiza category e dispara fetchFlows', async () => {
      api.get.mockResolvedValue({ data: [] });

      useFlowStore.getState().setCategory('tecnologia');

      expect(useFlowStore.getState().category).toBe('tecnologia');
    });
  });

  describe('setSearchTerm', () => {
    it('atualiza searchTerm e dispara fetchFlows', () => {
      api.get.mockResolvedValue({ data: [] });

      useFlowStore.getState().setSearchTerm('onboarding');

      expect(useFlowStore.getState().searchTerm).toBe('onboarding');
    });
  });
});
