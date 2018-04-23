enum Error {
  ShopParamMissing = 'Expected a shop query parameter',
  InvalidHMAC = 'HMAC validation failed',
  AccessTokenFetchFailure = 'Could not fetch access token',
  NonceMatchFailed = 'Request origin could not be verified',
}

export default Error;
