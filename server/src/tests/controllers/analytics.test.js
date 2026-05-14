'use strict';

const mockSequelize = {
  fn: jest.fn((name, col) => `${name}(${col})`),
  col: jest.fn((col) => col),
};

jest.mock('../../models', () => ({
  sequelize: mockSequelize,
  ViewEvento: {
    create: jest.fn(),
    count: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  },
  Flow: {
    findAll: jest.fn(),
    count: jest.fn(),
  },
  Execucao: {
    count: jest.fn(),
  },
  Op: require('sequelize').Op,
}));

const analyticsController = require('../../controllers/analyticsController');
const { ViewEvento, Flow, Execucao } = require('../../models');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('analyticsController.registrarEvento', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retorna 400 sem flow_id', async () => {
    const req = { body: {}, usuario: null };
    const res = mockRes();

    await analyticsController.registrarEvento(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('cria evento e retorna 201', async () => {
    ViewEvento.create.mockResolvedValue({});

    const req = {
      body: { flow_id: 'flow-uuid', no_id: 'no-1' },
      usuario: { id: 'user-uuid' },
    };
    const res = mockRes();

    await analyticsController.registrarEvento(req, res);

    expect(ViewEvento.create).toHaveBeenCalledWith({
      flow_id: 'flow-uuid',
      no_id: 'no-1',
      usuario_id: 'user-uuid',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  it('aceita requisição sem usuário autenticado (usuario=null)', async () => {
    ViewEvento.create.mockResolvedValue({});

    const req = { body: { flow_id: 'flow-uuid' }, usuario: null };
    const res = mockRes();

    await analyticsController.registrarEvento(req, res);

    expect(ViewEvento.create).toHaveBeenCalledWith(
      expect.objectContaining({ usuario_id: null })
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe('analyticsController.getAnalyticsUsuario', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retorna stats zeradas quando usuário não tem flows', async () => {
    Flow.findAll.mockResolvedValue([]);
    Flow.count.mockResolvedValue(0);
    Execucao.count.mockResolvedValue(0);

    const req = { usuario: { id: 'user-sem-flows' } };
    const res = mockRes();

    await analyticsController.getAnalyticsUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const responseData = res.json.mock.calls[0][0];
    expect(responseData.total_flows).toBe(0);
    expect(responseData.forks_recebidos).toBe(0);
    expect(responseData.top_flows).toEqual([]);
  });

  it('agrega stats corretamente para usuário com flows', async () => {
    const mockFlows = [
      { id: 'f1', titulo: 'Flow 1', visualizacoes: 100 },
      { id: 'f2', titulo: 'Flow 2', visualizacoes: 50 },
    ];
    Flow.findAll.mockResolvedValue(mockFlows);
    ViewEvento.findAll.mockResolvedValue([
      { flow_id: 'f1', view_eventos: '30' },
    ]);
    Flow.count.mockResolvedValue(2);
    Execucao.count.mockResolvedValue(5);

    const req = { usuario: { id: 'user-com-flows' } };
    const res = mockRes();

    await analyticsController.getAnalyticsUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const data = res.json.mock.calls[0][0];
    expect(data.total_flows).toBe(2);
    expect(data.total_visualizacoes).toBe(150);
    expect(data.execucoes_concluidas).toBe(5);
    expect(data.top_flows).toHaveLength(2);
  });
});
