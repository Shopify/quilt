import * as keywords from '@src/keywords.json';

import {Keywords} from '@types';

export default function keywordToHsb(keyword: Keywords) {
  return keywords[keyword].hsb;
}
