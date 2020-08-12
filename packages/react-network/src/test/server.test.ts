import {
  StatusCode,
  CspDirective,
  SpecialSource,
  Header,
} from '@shopify/network';
import {createMockContext} from '@shopify/jest-koa-mocks';
import cookie from 'cookie';

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

  describe('headers', () => {
    it('can set arbitrary headers', () => {
      const manager = new NetworkManager();
      const ctx = createMockContext();
      const spy = jest.spyOn(ctx, 'set');

      const header = 'X-Cool-Stuff';
      const value = 'true';

      manager.setHeader(header, value);
      applyToContext(ctx, manager);

      expect(spy).toHaveBeenCalledWith(header, value);
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
        `${CspDirective.DefaultSrc} ${SpecialSource.Self}; ${CspDirective.StyleSrc} ${SpecialSource.Self} ${SpecialSource.Blob}; ${CspDirective.BlockAllMixedContent}`,
      );
    });
  });

  describe('cookies', () => {
    it('doesn’t reset existing cookies', () => {
      const cookieString = '_cookieA=this%2Bhas%2Ba%2Bplus; _cookieB=';
      const ctx = createMockContext({
        cookies: cookie.parse(cookieString),
      });
      const manager = new NetworkManager({
        cookies: cookieString,
      });

      applyToContext(ctx, manager);

      expect(ctx.cookies.set).not.toHaveBeenCalledWith(
        '_cookieA',
        'this%2Bhas%2Ba%2Bplus',
        {},
      );
      expect(ctx.cookies.set).not.toHaveBeenCalledWith('_cookieB', '', {});
    });

    it('does set changed cookies', () => {
      const cookieString = '_cookieA=this%2Bhas%2Ba%2Bplus; _cookieB=';
      const ctx = createMockContext({
        cookies: cookie.parse(cookieString),
      });
      const manager = new NetworkManager({
        cookies: '_cookieA=this%2Bhas%2Ba%2Bplus; _cookieB=',
      });

      manager.cookies.setCookie('_cookieA', 'new_value');
      applyToContext(ctx, manager);
      expect(ctx.cookies.set).toHaveBeenCalledWith('_cookieA', 'new_value', {});
      expect(ctx.cookies.set).not.toHaveBeenCalledWith('_cookieB', '', {});
    });
  });
});
