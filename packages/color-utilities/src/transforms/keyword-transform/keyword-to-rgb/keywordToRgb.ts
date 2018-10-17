import * as keywords from '@src/keywords.json';

import {Keywords} from '@types';

export default function keywordToRgb(keyword: Keywords) {
  return keywords[keyword].rgb;
}
