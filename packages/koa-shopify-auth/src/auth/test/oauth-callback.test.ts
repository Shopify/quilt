describe('OAuthCallback', () => {
  // pending koa mocks being merged
  pending();
  it('throws a 400 if the hmac is invalid', async () => {});

  it('throws a 400 if the shop query parameter is not present', async () => {});

  it('fetches an access token', async () => {});

  it('throws a 401 if the token request fails', async () => {});

  it('includes the shop and accessToken on session if the token request succeeds', async () => {});

  it('includes the shop and accesstoken on state if the token request succeeds', async () => {});

  it('calls afterAuth with ctx when the token request succeeds', async () => {});
});
