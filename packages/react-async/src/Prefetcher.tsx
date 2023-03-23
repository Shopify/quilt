import React from 'react';

import type {PrefetchManager} from './context/prefetch';
import {PrefetchContext} from './context/prefetch';
import {EventListener} from './EventListener';

interface Props {
  manager: PrefetchManager;
}

interface State {
  url?: URL;
}

interface NavigatorWithConnection extends Navigator {
  connection: {saveData: boolean};
}

export const INTENTION_DELAY_MS = 150;
export const SENSITIVITY = 15;

class ConnectedPrefetcher extends React.PureComponent<Props, State> {
  state: State = {};
  private timeout?: ReturnType<typeof setTimeout>;
  private timeoutUrl?: URL;
  private prefetchAgressively = shouldPrefetchAggressively();
  // Initial position of the mouse
  private iX = 0;
  private iY = 0;
  // Final position of the mouse
  private fX = 0;
  private fY = 0;

  render() {
    const {url} = this.state;
    const {manager} = this.props;
    const preloadMarkup = url ? (
      <div style={{visibility: 'hidden'}}>
        {findMatches(manager.registered, url).map(({render, path}, index) => {
          // eslint-disable-next-line react/no-array-index-key
          return <div key={`${path}${index}`}>{render(url)}</div>;
        })}
      </div>
    ) : null;

    const expensiveListeners = this.prefetchAgressively ? (
      <>
        <EventListener
          passive
          event="mouseover"
          handler={this.handlePointerEnter}
        />
        <EventListener
          passive
          event="focusin"
          handler={this.handlePointerEnter}
        />
        <EventListener
          passive
          event="mouseout"
          handler={this.handlePointerLeave}
        />
        <EventListener
          passive
          event="focusout"
          handler={this.handlePointerLeave}
        />
        <EventListener
          passive
          event="mousemove"
          handler={this.handleMouseMove}
        />
      </>
    ) : null;

    return (
      <>
        <EventListener
          passive
          event="mousedown"
          handler={this.handlePressStart}
        />
        <EventListener
          passive
          event="touchstart"
          handler={this.handlePressStart}
        />
        {expensiveListeners}
        {preloadMarkup}
      </>
    );
  }

  private handleMouseMove = ({clientX, clientY}: MouseEvent) => {
    this.iX = clientX;
    this.iY = clientY;
  };

  private handlePressStart = ({target}: MouseEvent) => {
    this.clearTimeout();

    if (target == null) {
      return;
    }

    const url = closestUrlFromNode(target);

    if (url != null) {
      this.setState({url});
    }
  };

  private compare = (url: URL | undefined) => {
    const {iX, iY} = this;
    this.clearTimeout();
    // Calculate the change of the mouse position
    // If it is smaller than the sensitivity, we can assume that the user is intending on visiting the link
    if (Math.hypot(this.fX - iX, this.fY - iY) < SENSITIVITY) {
      this.setState({url});
    } else {
      this.fX = iX;
      this.fY = iY;
      this.timeout = setTimeout(() => this.compare(url), INTENTION_DELAY_MS);
    }
  };

  private handlePointerLeave = ({
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

    const closestUrl = closestUrlFromNode(target);
    const relatedUrl = relatedTarget && closestUrlFromNode(relatedTarget);

    if (
      timeout != null &&
      urlsEqual(closestUrl, timeoutUrl) &&
      !urlsEqual(relatedUrl, timeoutUrl)
    ) {
      this.clearTimeout();
    }

    if (urlsEqual(closestUrl, url) && !urlsEqual(relatedUrl, url)) {
      this.setState({url: undefined});
    }
  };

  private handlePointerEnter = (event: MouseEvent | FocusEvent) => {
    const {target} = event;
    if (target == null) {
      return;
    }

    const {timeoutUrl, timeout} = this;
    const url = closestUrlFromNode(target);

    if (url == null) {
      return;
    }

    if (timeout) {
      if (urlsEqual(url, timeoutUrl)) {
        return;
      } else {
        this.clearTimeout();
      }
    }

    this.timeoutUrl = url;
    // If the event is a mouse event, record initial mouse position upon entering the element
    this.timeout = setTimeout(() => {
      this.clearTimeout();
      if ('clientX' in event && 'clientY' in event) {
        this.compare(url);
      } else {
        this.setState({url});
      }
    }, INTENTION_DELAY_MS);
  };

  private clearTimeout() {
    if (this.timeout != null) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
      this.timeoutUrl = undefined;
    }
  }
}

export function Prefetcher(props: Omit<Props, 'manager'>) {
  return (
    <PrefetchContext.Consumer>
      {(manager) => <ConnectedPrefetcher {...props} manager={manager} />}
    </PrefetchContext.Consumer>
  );
}

function shouldPrefetchAggressively() {
  return (
    typeof navigator === 'undefined' ||
    !('connection' in navigator) ||
    !(navigator as NavigatorWithConnection).connection.saveData
  );
}

function urlsEqual(first?: URL | null, second?: URL) {
  return (
    (first == null && first === second) ||
    (first != null && second != null && first.href === second.href)
  );
}

function findMatches(records: PrefetchManager['registered'], url: URL) {
  return [...records].filter(({path: match}) => matches(url, match));
}

function matches(url: URL, matcher: string | RegExp) {
  return typeof matcher === 'string'
    ? matcher === url.pathname
    : matcher.test(url.pathname);
}

function closestUrlFromNode(element: EventTarget) {
  if (!(element instanceof HTMLElement)) {
    return undefined;
  }

  // data-href is a hack for resource list doing the <a> as a sibling
  const closestUrl = element.closest('[href], [data-href]');

  if (closestUrl == null || !(closestUrl instanceof HTMLElement)) {
    return undefined;
  }

  const url =
    closestUrl.getAttribute('href') || closestUrl.getAttribute('data-href');

  try {
    return url ? new URL(url, window.location.href) : undefined;
  } catch (error) {
    return undefined;
  }
}
