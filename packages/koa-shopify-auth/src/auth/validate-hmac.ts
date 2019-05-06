import querystring from 'querystring';
import crypto from 'crypto';
import {Context} from 'koa';
import safeCompare from 'safe-compare';

export default function validateHmac(
  hmac: string,
  secret: string,
  query: Context['query'],
) {
  const {hmac: _hmac, signature: _signature, ...map} = query;

  const orderedMap = Object.keys(map)
    .sort()
    .reduce((accum, key) => {
      accum[key] = map[key];
      return accum;
    }, {});

  const message = querystring.stringify(orderedMap);
  const generatedHash = crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');

  return safeCompare(generatedHash, hmac);
}
