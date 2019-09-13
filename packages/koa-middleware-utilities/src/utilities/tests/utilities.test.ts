import {createMockContext} from '@shopify/jest-koa-mocks';
import {runIf, noopNext} from '../utilities';

describe('koa-middleware utilities', () => {
  describe('runIf()', () => {
    it('does not call the middleware when the condition returns false but calls next', async () => {
      const middleware = jest.fn();
      const condition = jest.fn(() => false);
      const next = jest.fn();

      await runIf(condition, middleware)(createMockContext(), next);

      expect(middleware).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith();
    });

    it('calls the `if` middleware when the condition returns true and only one middleware is provided', async () => {
      const middleware = jest.fn();
      const condition = jest.fn(() => true);
      const context = createMockContext();
      const next = noopNext;

      await runIf(condition, middleware)(context, next);

      expect(middleware).toHaveBeenCalledWith(context, next);
    });

    it('calls the `if` middleware when the condition returns true and 2 middlewares are provided', async () => {
      const ifMiddleware = jest.fn();
      const elseMiddleware = jest.fn();

      const condition = jest.fn(() => true);
      const context = createMockContext();

      const next = jest.fn();

      await runIf(condition, ifMiddleware, elseMiddleware)(context, next);

      expect(elseMiddleware).not.toHaveBeenCalled();
      expect(ifMiddleware).toHaveBeenCalledWith(context, next);
    });

    it('calls the `else` middleware when the condition returns false and 2 middlewares are provided', async () => {
      const ifMiddleware = jest.fn();
      const elseMiddleware = jest.fn();

      const condition = jest.fn(() => false);
      const context = createMockContext();

      const next = jest.fn();

      await runIf(condition, ifMiddleware, elseMiddleware)(context, next);

      expect(ifMiddleware).not.toHaveBeenCalled();
      expect(elseMiddleware).toHaveBeenCalledWith(context, next);
    });
  });
});
