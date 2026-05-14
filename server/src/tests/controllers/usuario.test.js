'use strict';

jest.mock('../../models', () => ({
  Usuario: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock.jwt.token'),
}));

process.env.JWT_SECRET = 'test-secret';

const usuarioController = require('../../controllers/usuarioController');
const bcrypt = require('bcryptjs');
const { Usuario } = require('../../models');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('usuarioController.cadastrar', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retorna 400 se campos obrigatórios ausentes', async () => {
    const req = { body: { nome: 'Teste' } };
    const res = mockRes();

    await usuarioController.cadastrar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ mensagem: expect.stringContaining('obrigatórios') })
    );
  });

  it('retorna 409 se email já cadastrado', async () => {
    Usuario.findOne.mockResolvedValue({ id: 'existing-user' });

    const req = { body: { nome: 'Teste', email: 'teste@email.com', senha: '123456' } };
    const res = mockRes();

    await usuarioController.cadastrar(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ mensagem: 'E-mail já cadastrado.' })
    );
  });

  it('cria usuário e retorna 201', async () => {
    Usuario.findOne.mockResolvedValue(null);
    Usuario.create.mockResolvedValue({ id: 'new-uuid', nome: 'Novo User', email: 'novo@email.com' });

    const req = { body: { nome: 'Novo User', email: 'novo@email.com', senha: 'senha123' } };
    const res = mockRes();

    await usuarioController.cadastrar(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith('senha123', 10);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ mensagem: 'Usuário cadastrado com sucesso!' })
    );
  });
});

describe('usuarioController.login', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retorna 404 se usuário não encontrado', async () => {
    Usuario.findOne.mockResolvedValue(null);

    const req = { body: { email: 'nao@existe.com', senha: '123' } };
    const res = mockRes();

    await usuarioController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('retorna 401 se senha incorreta', async () => {
    Usuario.findOne.mockResolvedValue({ id: 'u1', senha_hash: 'hashed' });
    bcrypt.compare.mockResolvedValue(false);

    const req = { body: { email: 'user@email.com', senha: 'errada' } };
    const res = mockRes();

    await usuarioController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ mensagem: 'Senha incorreta.' })
    );
  });

  it('retorna token JWT em login bem-sucedido', async () => {
    Usuario.findOne.mockResolvedValue({ id: 'u1', nome: 'User', senha_hash: 'hashed' });
    bcrypt.compare.mockResolvedValue(true);

    const req = { body: { email: 'user@email.com', senha: 'correta' } };
    const res = mockRes();

    await usuarioController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ token: 'mock.jwt.token' })
    );
  });
});
