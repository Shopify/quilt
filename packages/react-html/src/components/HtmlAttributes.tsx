import {useHtmlAttributes} from '../hooks';

type Props = Parameters<typeof useHtmlAttributes>[0];

export function HtmlAttributes(props: Props) {
  useHtmlAttributes(props);
  return null;
}
