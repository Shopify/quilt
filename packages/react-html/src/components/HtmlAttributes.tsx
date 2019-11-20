import {FirstArgument} from '@shopify/useful-types';

import {useHtmlAttributes} from '../hooks';

type Props = FirstArgument<typeof useHtmlAttributes>;

export function HtmlAttributes(props: Props) {
  useHtmlAttributes(props);
  return null;
}
