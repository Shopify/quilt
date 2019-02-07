import * as React from 'react';
import {AsyncManager, Manager} from './manager';
import {Prefetcher} from './Prefetcher';
import {AsyncContext} from './context';

interface Props {
  children?: React.ReactNode;
  manager?: Manager;
}

export class AsyncProvider extends React.PureComponent<Props> {
  private manager = this.props.manager || new AsyncManager();

  render() {
    return (
      <>
        <Prefetcher manager={this.manager} />
        <AsyncContext.Provider value={this.manager}>
          {this.props.children}
        </AsyncContext.Provider>
      </>
    );
  }
}
