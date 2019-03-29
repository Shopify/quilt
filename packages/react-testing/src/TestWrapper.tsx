import * as React from 'react';

interface State<ChildProps> {
  props?: Partial<ChildProps>;
}

interface Props {
  children: React.ReactElement<any>;
}

export class TestWrapper<ChildProps> extends React.Component<
  Props,
  State<ChildProps>
> {
  state: State<ChildProps> = {};

  setProps(props: Partial<ChildProps>) {
    this.setState({props});
  }

  render() {
    const {props} = this.state;
    const {children} = this.props;
    return props ? React.cloneElement(children, props) : children;
  }
}
