import requestStorageAccess from '../client/request-storage-access';

describe('requestStorageAccess', () => {
  it('uses /my-prefix/auth/ when /my-prefix is passed as the prefix', () => {
    const script = requestStorageAccess('', '/my-prefix');

    expect(script).toContain('hasStorageAccessUrl: "/my-prefix/auth');
    expect(script).toContain('doesNotHaveStorageAccessUrl: "/my-prefix/auth');
  });

  it('includes my-prefix in the appTargetUrl', () => {
    const script = requestStorageAccess('', '/my-prefix');

    expect(script).toContain('appTargetUrl: "/my-prefix/?shop=');
  });

  it('uses /auth when no prefix is passed in', () => {
    const script = requestStorageAccess('', undefined);

    expect(script).toContain('hasStorageAccessUrl: "/auth');
    expect(script).toContain('doesNotHaveStorageAccessUrl: "/auth');
  });

  it('appTargetUrl starts with /?shop= when no prefix is passed in', () => {
    const script = requestStorageAccess('', undefined);

    expect(script).toContain('appTargetUrl: "/?shop=');
  });
});
