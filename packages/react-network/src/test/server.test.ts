import {
  StatusCode,
  CspDirective,
  SpecialSource,
  Header,
} from '@shopify/network';
import {createMockContext} from '@shopify/jest-koa-mocks';

import {NetworkManager, applyToContext} from '../server';

describe('server', () => {
  describe('status', () => {
    it('sets a status code', () => {
      const manager = new NetworkManager();
      const ctx = createMockContext();
      const status = StatusCode.NotFound;

      manager.addStatusCode(status);
      applyToContext(ctx, manager);

      expect(ctx.status).toBe(status);
    });

    it('uses the largest status code', () => {
      const manager = new NetworkManager();
      const ctx = createMockContext();
      const status = StatusCode.NotFound;

      manager.addStatusCode(status);
      manager.addStatusCode(StatusCode.Ok);
      applyToContext(ctx, manager);

      expect(ctx.status).toBe(status);
    });
  });

  describe('redirect', () => {
    it('redirects to the passed URL', () => {
      const manager = new NetworkManager();
      const ctx = createMockContext();
      const url = 'https://snowdevil.com';

      manager.redirectTo(url);
      applyToContext(ctx, manager);

      expect(ctx.redirect).toHaveBeenCalledWith(url);
    });

    it('sets a custom redirect status code', () => {
      const manager = new NetworkManager();
      const ctx = createMockContext();
      const status = StatusCode.TemporaryRedirect;

      manager.redirectTo('https://snowdevil.com', status);
      applyToContext(ctx, manager);

      expect(ctx.status).toBe(status);
    });
  });

  describe('csp', () => {
    it('does not set a CSP header if no directives were set', () => {
      const manager = new NetworkManager();
      const ctx = createMockContext();
      const spy = jest.spyOn(ctx, 'set');

      applyToContext(ctx, manager);

      expect(spy).not.toHaveBeenCalled();
    });

    it('sets the CSP header with strings, booleans, and string arrays', () => {
      const manager = new NetworkManager();
      const ctx = createMockContext();
      const spy = jest.spyOn(ctx, 'set');

      manager.addCspDirective(CspDirective.DefaultSrc, SpecialSource.Self);
      manager.addCspDirective(CspDirective.StyleSrc, [
        SpecialSource.Self,
        SpecialSource.Blob,
      ]);
      manager.addCspDirective(CspDirective.BlockAllMixedContent, true);

      applyToContext(ctx, manager);

      expect(spy).toHaveBeenCalledWith(
        Header.ContentSecurityPolicy,
        `${CspDirective.DefaultSrc} ${SpecialSource.Self}; ${
          CspDirective.StyleSrc
        } ${SpecialSource.Self} ${SpecialSource.Blob}; ${
          CspDirective.BlockAllMixedContent
        }`,
      );
    });
  });
});
