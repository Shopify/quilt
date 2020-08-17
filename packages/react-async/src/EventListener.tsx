import React from 'react';

export interface BaseEventProps {
  event: string;
  capture?: boolean;
  handler(event: Event): void;
}

export interface Props extends BaseEventProps {
  passive?: boolean;
}

// see https://github.com/oliviertassinari/react-event-listener/
export class EventListener extends React.PureComponent<Props, never> {
  componentDidMount() {
    this.attachListener();
  }

  componentDidUpdate({passive, ...detachProps}: Props) {
    this.detachListener(detachProps);
    this.attachListener();
  }

  componentWillUnmount() {
    this.detachListener();
  }

  render() {
    return null;
  }

  private attachListener() {
    const {event, handler, capture, passive} = this.props;
    window.addEventListener(event, handler, {capture, passive});
  }

  private detachListener(prevProps?: BaseEventProps) {
    const {event, handler, capture} = prevProps || this.props;
    window.removeEventListener(event, handler, capture);
  }
}
