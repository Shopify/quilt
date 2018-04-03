describe('verifyRequest', () => {
  // pending koa mocks being merged
  pending();
  it('calls next if there is an accessToken on session', async () => {});

  it('redirects to auth if there is no accessToken but ship is present on query', async () => {});

  it('redirects to the fallbackRoute when there is no accessToken or known shop', async () => {});
});
