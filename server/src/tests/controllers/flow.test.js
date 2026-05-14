'use strict';

jest.mock('../../models', () => ({
  Flow: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
  Usuario: {},
  Comentario: {},
  PostagemComunidade: {
    findByPk: jest.fn(),
  },
  Op: require('sequelize').Op,
}));

const flowController = require('../../controllers/flowController');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const { Flow, PostagemComunidade } = require('../../models');

describe('flowController.listar', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retorna lista de flows com status 200', async () => {
    const mockFlows = [{ id: 'uuid-1', titulo: 'Flow Teste' }];
    Flow.findAll.mockResolvedValue(mockFlows);

    const req = { query: {} };
    const res = mockRes();

    await flowController.listar(req, res);

    expect(Flow.findAll).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(mockFlows);
  });

  it('retorna 500 em caso de erro de banco', async () => {
    Flow.findAll.mockRejectedValue(new Error('DB error'));

    const req = { query: {} };
    const res = mockRes();

    await flowController.listar(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ erro: expect.any(String) })
    );
  });
});

describe('flowController.obter', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retorna 404 quando flow não existe', async () => {
    Flow.findByPk.mockResolvedValue(null);

    const req = { params: { id: 'uuid-inexistente' } };
    const res = mockRes();

    await flowController.obter(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ erro: 'Flow não encontrado' });
  });

  it('retorna flow e incrementa visualizações', async () => {
    const mockFlow = {
      id: 'uuid-1',
      titulo: 'Flow A',
      increment: jest.fn().mockResolvedValue(),
    };
    Flow.findByPk.mockResolvedValue(mockFlow);

    const req = { params: { id: 'uuid-1' } };
    const res = mockRes();

    await flowController.obter(req, res);

    expect(mockFlow.increment).toHaveBeenCalledWith('visualizacoes');
    expect(res.json).toHaveBeenCalledWith(mockFlow);
  });
});

describe('flowController.criar', () => {
  beforeEach(() => jest.clearAllMocks());

  it('cria flow e retorna 201 com id', async () => {
    const mockFlow = { id: 'new-uuid' };
    Flow.create.mockResolvedValue(mockFlow);

    const req = {
      body: { titulo: 'Novo Flow', descricao: 'desc', status: 'rascunho' },
      usuarioId: 'user-uuid',
    };
    const res = mockRes();

    await flowController.criar(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ flow_id: 'new-uuid' })
    );
  });

  it('retorna 400 se post_id fornecido não existe', async () => {
    PostagemComunidade.findByPk.mockResolvedValue(null);

    const req = {
      body: { titulo: 'Flow', post_id: 'post-inexistente' },
      usuarioId: 'user-uuid',
    };
    const res = mockRes();

    await flowController.criar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ erro: 'Post relacionado não encontrado' });
  });
});

describe('flowController.atualizar', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retorna 404 quando flow não existe', async () => {
    Flow.findByPk.mockResolvedValue(null);

    const req = { params: { id: 'uuid-x' }, body: {}, usuarioId: 'user-1' };
    const res = mockRes();

    await flowController.atualizar(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('retorna 403 quando usuário não é o criador', async () => {
    Flow.findByPk.mockResolvedValue({ id: 'uuid-1', criado_por: 'outro-user' });

    const req = { params: { id: 'uuid-1' }, body: {}, usuarioId: 'user-1' };
    const res = mockRes();

    await flowController.atualizar(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ erro: 'Permissão negada' });
  });
});
