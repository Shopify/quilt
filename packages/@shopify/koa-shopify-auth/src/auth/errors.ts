enum Error {
  ShopParamMissing = 'Expected a valid shop query parameter',
  InvalidHmac = 'HMAC validation failed',
  AccessTokenFetchFailure = 'Could not fetch access token',
  NonceMatchFailed = 'Request origin could not be verified',
}

export default Error;
