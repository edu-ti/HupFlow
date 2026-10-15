import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { GetOrgFromRequest } from './org.from.request';
import { GetUserFromRequest } from './user.from.request';
import { ExecutionContext } from '@nestjs/common';

function getParamDecoratorFactory(decorator: Function) {
  class TestController {
    public testMethod(@decorator() value: any) {}
  }
  const args = Reflect.getMetadata(
    ROUTE_ARGS_METADATA,
    TestController,
    'testMethod'
  );
  return args[Object.keys(args)[0]].factory;
}

describe('Param Decorators (GetOrgFromRequest & GetUserFromRequest)', () => {
  it('GetOrgFromRequest deve extrair request.org do ExecutionContext', () => {
    const factory = getParamDecoratorFactory(GetOrgFromRequest);

    const mockOrg = {
      id: 'org-test-123',
      name: 'Test Organization',
    };

    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          org: mockOrg,
        }),
      }),
    } as unknown as ExecutionContext;

    const result = factory(null, mockExecutionContext);
    expect(result).toBe(mockOrg);
    expect(result.id).toBe('org-test-123');
  });

  it('GetUserFromRequest deve extrair request.user do ExecutionContext', () => {
    const factory = getParamDecoratorFactory(GetUserFromRequest);

    const mockUser = {
      id: 'user-test-456',
      email: 'tester@hupflow.com',
    };

    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: mockUser,
        }),
      }),
    } as unknown as ExecutionContext;

    const result = factory(null, mockExecutionContext);
    expect(result).toBe(mockUser);
    expect(result.id).toBe('user-test-456');
  });
});
