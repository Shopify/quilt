import React from 'react';

interface State<ChildProps> {
  props?: Partial<ChildProps>;
}

interface Props {
  children: React.ReactElement<any>;
  render(element: React.ReactElement<any>): React.ReactElement<any>;
}

export class TestWrapper<ChildProps> extends React.Component<
  Props,
  State<ChildProps>
> {
  state: State<ChildProps> = {};
  // eslint-disable-next-line @shopify/react-prefer-private-members
  rootRef: React.Component | null = null;

  // eslint-disable-next-line @shopify/react-prefer-private-members
  setProps(props: Partial<ChildProps>) {
    this.setState({props});
  }

  render() {
    const {props} = this.state;
    const {children, render} = this.props;
    const rootElement = props ? React.cloneElement(children, props) : children;

    return render(
      <TestInnerWrapper ref={this.setRef}>{rootElement}</TestInnerWrapper>,
    );
  }

  private setRef = (ref: any) => {
    this.rootRef = ref;
  };
}

class TestInnerWrapper extends React.Component<{
  children: React.ReactElement<any>;
}> {
  render() {
    return this.props.children;
  }
}
