import * as keywords from '"@src/keywords.json';

import {Keywords} from '@types';

export default function keywordToHsl(keyword: Keywords) {
  return keywords[keyword].hsl;
}
