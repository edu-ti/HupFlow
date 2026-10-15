import { AuthMiddleware } from './auth.middleware';
import { AuthService } from '@gitroom/helpers/auth/auth.service';
import { HttpForbiddenException } from '@gitroom/nestjs-libraries/services/exception.filter';
import { Request, Response, NextFunction } from 'express';

describe('AuthMiddleware (Unit Tests - Multi-tenant & Security)', () => {
  let middleware: AuthMiddleware;
  let mockOrganizationService: any;
  let mockUsersService: any;
  let req: Partial<Request> & { org?: any; user?: any };
  let res: Partial<Response>;
  let next: jest.MockedFunction<NextFunction>;

  const mockActiveUser = {
    id: 'user-123',
    email: 'user@example.com',
    activated: true,
    isSuperAdmin: false,
    password: 'hashed-password-123',
  };

  const mockOrgs = [
    {
      id: 'org-primary',
      name: 'Primary Org',
      paymentId: 'cus_123',
      apiKey: 'api-key-1',
      users: [{ userId: 'user-123', disabled: false }],
    },
    {
      id: 'org-secondary',
      name: 'Secondary Org',
      paymentId: null,
      apiKey: 'api-key-2',
      users: [{ userId: 'user-123', disabled: false }],
    },
  ];

  beforeEach(() => {
    mockOrganizationService = {
      getOrgsByUserId: jest.fn().mockResolvedValue(mockOrgs),
      getUserOrg: jest.fn(),
      updateApiKey: jest.fn().mockResolvedValue(true),
    };

    mockUsersService = {
      getUserById: jest.fn().mockResolvedValue({ ...mockActiveUser }),
    };

    middleware = new AuthMiddleware(
      mockOrganizationService,
      mockUsersService
    );

    req = {
      headers: {},
      cookies: {},
    };

    res = {
      cookie: jest.fn(),
      header: jest.fn(),
    };

    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('Autenticação e Rejeição de Não Autenticados', () => {
    it('deve lançar HttpForbiddenException quando não há header nem cookie de auth', async () => {
      req.headers = {};
      req.cookies = {};

      await expect(
        middleware.use(req as Request, res as Response, next)
      ).rejects.toThrow(HttpForbiddenException);
      expect(next).not.toHaveBeenCalled();
    });

    it('deve lançar HttpForbiddenException quando o token JWT for inválido ou nulo', async () => {
      req.headers = { auth: 'invalid-token' };
      jest.spyOn(AuthService, 'verifyJWT').mockReturnValue(null);

      await expect(
        middleware.use(req as Request, res as Response, next)
      ).rejects.toThrow(HttpForbiddenException);
      expect(next).not.toHaveBeenCalled();
    });

    it('deve lançar HttpForbiddenException quando o payload JWT não contiver id', async () => {
      req.headers = { auth: 'valid-token' };
      jest.spyOn(AuthService, 'verifyJWT').mockReturnValue({} as any);

      await expect(
        middleware.use(req as Request, res as Response, next)
      ).rejects.toThrow(HttpForbiddenException);
      expect(next).not.toHaveBeenCalled();
    });

    it('deve lançar HttpForbiddenException quando o usuário não existir no banco de dados', async () => {
      req.headers = { auth: 'valid-token' };
      jest.spyOn(AuthService, 'verifyJWT').mockReturnValue({ id: 'non-existent' } as any);
      mockUsersService.getUserById.mockResolvedValue(null);

      await expect(
        middleware.use(req as Request, res as Response, next)
      ).rejects.toThrow(HttpForbiddenException);
      expect(next).not.toHaveBeenCalled();
    });

    it('deve lançar HttpForbiddenException quando o usuário estiver desativado (activated = false)', async () => {
      req.headers = { auth: 'valid-token' };
      jest.spyOn(AuthService, 'verifyJWT').mockReturnValue({ id: 'user-123' } as any);
      mockUsersService.getUserById.mockResolvedValue({
        ...mockActiveUser,
        activated: false,
      });

      await expect(
        middleware.use(req as Request, res as Response, next)
      ).rejects.toThrow(HttpForbiddenException);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Isolamento Multi-tenant e Atribuição de Organização', () => {
    it('deve atribuir a primeira organização ativa e remover a senha do usuário em requisição normal', async () => {
      req.headers = { auth: 'valid-token' };
      jest.spyOn(AuthService, 'verifyJWT').mockReturnValue({ id: 'user-123' } as any);

      await middleware.use(req as Request, res as Response, next);

      expect(req.user).toBeDefined();
      expect(req.user.id).toBe('user-123');
      expect(req.user.password).toBeUndefined();
      expect(req.org).toBeDefined();
      expect(req.org.id).toBe('org-primary');
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('deve selecionar a organização informada via header showorg quando o usuário for membro dela', async () => {
      req.headers = {
        auth: 'valid-token',
        showorg: 'org-secondary',
      };
      jest.spyOn(AuthService, 'verifyJWT').mockReturnValue({ id: 'user-123' } as any);

      await middleware.use(req as Request, res as Response, next);

      expect(req.org.id).toBe('org-secondary');
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('deve ignorar showorg forjado para organização de terceiro e manter a organização legítima do usuário', async () => {
      req.headers = {
        auth: 'valid-token',
        showorg: 'org-de-outro-cliente',
      };
      jest.spyOn(AuthService, 'verifyJWT').mockReturnValue({ id: 'user-123' } as any);

      await middleware.use(req as Request, res as Response, next);

      // Não seleciona 'org-de-outro-cliente', recorre à legítima do usuário
      expect(req.org.id).toBe('org-primary');
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('deve lançar HttpForbiddenException se o usuário não pertencer a nenhuma organização ativa', async () => {
      req.headers = { auth: 'valid-token' };
      jest.spyOn(AuthService, 'verifyJWT').mockReturnValue({ id: 'user-123' } as any);
      mockOrganizationService.getOrgsByUserId.mockResolvedValue([]);

      await expect(
        middleware.use(req as Request, res as Response, next)
      ).rejects.toThrow(HttpForbiddenException);
      expect(next).not.toHaveBeenCalled();
    });

    it('deve atualizar apiKey da organização caso ela ainda não possua', async () => {
      req.headers = { auth: 'valid-token' };
      jest.spyOn(AuthService, 'verifyJWT').mockReturnValue({ id: 'user-123' } as any);
      mockOrganizationService.getOrgsByUserId.mockResolvedValue([
        {
          id: 'org-sem-api-key',
          name: 'Org Sem Key',
          apiKey: null,
          users: [{ userId: 'user-123', disabled: false }],
        },
      ]);

      await middleware.use(req as Request, res as Response, next);

      expect(mockOrganizationService.updateApiKey).toHaveBeenCalledWith('org-sem-api-key');
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe('Fluxo de Impersonação (SuperAdmin)', () => {
    it('deve permitir impersonação quando o usuário for superAdmin e o cookie impersonate estiver presente', async () => {
      const superAdminUser = {
        ...mockActiveUser,
        isSuperAdmin: true,
      };

      const impersonatedTarget = {
        user: {
          id: 'target-user-456',
          email: 'target@example.com',
          activated: true,
          isSuperAdmin: false,
          password: 'secret-target',
        },
        organization: {
          id: 'target-org-789',
          name: 'Target Organization',
          paymentId: 'cus_target',
          users: [{ userId: 'target-user-456', disabled: false }],
        },
      };

      req.headers = { auth: 'superadmin-token' };
      req.cookies = { impersonate: 'target-org-789' };

      jest.spyOn(AuthService, 'verifyJWT').mockReturnValue({ id: 'user-123' } as any);
      mockUsersService.getUserById.mockResolvedValue(superAdminUser);
      mockOrganizationService.getUserOrg.mockResolvedValue(impersonatedTarget);

      await middleware.use(req as Request, res as Response, next);

      expect(mockOrganizationService.getUserOrg).toHaveBeenCalledWith('target-org-789');
      expect(req.user.id).toBe('target-user-456');
      expect(req.user.isSuperAdmin).toBe(true);
      expect(req.org.id).toBe('target-org-789');
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
