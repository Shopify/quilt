import * as React from 'react';
import {EventListener} from './EventListener';
import {Manager} from './manager';

interface Props {
  manager: Manager;
}

interface State {
  url?: string;
}

export const HOVER_DELAY_MS = 100;

export class Prefetcher extends React.PureComponent<Props, State> {
  state: State = {};
  private timeout?: ReturnType<typeof setTimeout>;
  private timeoutUrl?: string;

  render() {
    const {url} = this.state;
    const {manager} = this.props;
    const preloadMarkup = url
      ? findMatches(manager.registered, url).map(
          ({url: matchUrl, mapUrlToProps, component: Component}) => {
            const additionalProps = mapUrlToProps
              ? mapUrlToProps(url) || {}
              : {};
            const Prefetch =
              'Prefetch' in Component ? Component.Prefetch : Component;

            return <Prefetch {...additionalProps} key={String(matchUrl)} />;
          },
        )
      : null;

    return (
      <>
        <EventListener
          passive
          event="mouseover"
          handler={this.handleMouseOver}
        />
        <EventListener passive event="focusin" handler={this.handleMouseOver} />
        <EventListener
          passive
          event="mousedown"
          handler={this.handleMouseDown}
        />
        <EventListener
          passive
          event="mouseout"
          handler={this.handleMouseLeave}
        />
        <EventListener
          passive
          event="focusout"
          handler={this.handleMouseLeave}
        />
        {preloadMarkup}
      </>
    );
  }

  private handleMouseDown = ({target}: MouseEvent) => {
    this.clearTimeout();

    if (target == null) {
      return;
    }

    const url = closestHref(target);

    if (url != null) {
      this.setState({url});
    }
  };

  private handleMouseLeave = ({
    target,
    relatedTarget,
  }: MouseEvent | FocusEvent) => {
    const {url} = this.state;
    const {timeout, timeoutUrl} = this;

    if (target == null) {
      if (timeout) {
        this.clearTimeout();
      }

      return;
    }

    if (url == null && timeout == null) {
      return;
    }

    const closestUrl = closestHref(target);
    const relatedUrl = relatedTarget && closestHref(relatedTarget);

    if (
      timeout != null &&
      closestUrl === timeoutUrl &&
      relatedUrl !== timeoutUrl
    ) {
      this.clearTimeout();
    }

    if (closestUrl === url && relatedUrl !== url) {
      this.setState({url: undefined});
    }
  };

  private handleMouseOver = ({target}: MouseEvent | FocusEvent) => {
    if (target == null) {
      return;
    }

    const {timeoutUrl, timeout} = this;
    const url = closestHref(target);

    if (url == null) {
      return;
    }

    if (timeout) {
      if (url === timeoutUrl) {
        return;
      } else {
        this.clearTimeout();
      }
    }

    this.timeoutUrl = url;
    this.timeout = setTimeout(() => {
      this.clearTimeout();
      this.setState({url});
    }, HOVER_DELAY_MS);
  };

  private clearTimeout() {
    if (this.timeout != null) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
      this.timeoutUrl = undefined;
    }
  }
}

function findMatches(records: Manager['registered'], url: string) {
  return [...records].filter(({url: match}) => matches(url, match));
}

function matches(url: string, matcher: string | RegExp) {
  return typeof matcher === 'string' ? matcher === url : matcher.test(url);
}

function closestHref(element: EventTarget) {
  if (!(element instanceof HTMLElement)) {
    return undefined;
  }

  // data-href is a hack for resource list doing the <a> as a sibling
  const closestHref = element.closest('[href], [data-href]');

  if (closestHref == null || !(closestHref instanceof HTMLElement)) {
    return undefined;
  }

  const url =
    closestHref.getAttribute('href') || closestHref.getAttribute('data-href');

  try {
    return url ? new URL(url, window.location.href).pathname : undefined;
  } catch (error) {
    return undefined;
  }
}
