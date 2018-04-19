enum Error {
  ShopParamMissing = 'Expected a shop query parameter',
  InvalidHMAC = 'HMAC validation failed',
  AccessTokenError = 'Could not fetch access token',
}

export default Error;
