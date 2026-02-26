import {Context} from 'koa';
import querystring from 'querystring';
import safeCompare from 'safe-compare';
import crypto from 'crypto';

export default function validateHmac(
  hmac: string,
  secret: string,
  query: Context['query'],
) {
  const map = {...query};
  delete map.signature;
  delete map.hmac;

  const message = querystring.stringify(map);
  const generatedHash = crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');

  return safeCompare(generatedHash, hmac);
}
