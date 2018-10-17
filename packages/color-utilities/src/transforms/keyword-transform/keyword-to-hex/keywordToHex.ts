import * as keywords from '@src/keywords.json';

import {Keywords} from '@types';

export default function keywordToHex(keyword: Keywords) {
  return keywords[keyword].hex;
}
