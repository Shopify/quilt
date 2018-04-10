import * as React from 'react';
import {mount} from 'enzyme';
import {findByTestID, matchByTestID, trigger} from '..';

class MyComponent extends React.PureComponent<
  {
    callback?: (...args: any[]) => any;
  },
  {
    fooVisible: boolean;
  }
> {
  state = {
    fooVisible: true,
  };

  constructor(props) {
    super(props);
    this.toggleFoo = this.toggleFoo.bind(this);
    this.handleCallback = this.handleCallback.bind(this);
  }

  render() {
    return this.state.fooVisible ? (
      <button type="button" testID="Foo" onClick={this.toggleFoo}>
        Click Me, I foo!
      </button>
    ) : (
      <button type="button" onClick={this.handleCallback}>
        Foo is not visible
      </button>
    );
  }

  async handleCallback(...args: any[]) {
    if (this.props.callback != null) {
      await this.props.callback(...args);
    }

    this.toggleFoo();
  }

  toggleFoo() {
    this.setState(({fooVisible}) => ({
      fooVisible: !fooVisible,
    }));
  }
}

describe('enzyme-utilities', () => {
  describe('findByTestID', () => {
    it('finds an ID with an exact match', () => {
      const myComponent = mount(<MyComponent />);

      expect(findByTestID(myComponent, 'Foo')).toHaveLength(1);
    });
  });

  describe('matchByTestID', () => {
    it('finds an ID with an exact match', () => {
      const myComponent = mount(<MyComponent />);

      expect(matchByTestID(myComponent, /Fo*/)).toHaveLength(1);
    });
  });

  describe('trigger', () => {
    function wait() {
      return new Promise(resolve => {
        setTimeout(resolve, 100);
      });
    }

    it('works for synchronous callbacks', () => {
      const myComponent = mount(<MyComponent />);

      const button = myComponent.find('button');
      trigger(button, 'onClick');

      expect(findByTestID(myComponent, 'Foo')).toHaveLength(0);
    });

    it('works for callbacks with arguments', () => {
      const spy = jest.fn();

      const myComponent = mount(<MyComponent callback={spy} />);

      trigger(myComponent.find('button'), 'onClick');

      trigger(myComponent.find('button'), 'onClick', 'hello', 1, 2, 3);

      expect(spy).toHaveBeenCalledWith('hello', 1, 2, 3);
    });

    it('works for asynchronous callbacks', async () => {
      const spy = jest.fn();

      const myComponent = mount(<MyComponent callback={spy} />);

      trigger(myComponent.find('button'), 'onClick');

      const promise = trigger(myComponent.find('button'), 'onClick');

      expect(findByTestID(myComponent, 'Foo')).toHaveLength(0);

      await promise;

      expect(findByTestID(myComponent, 'Foo')).toHaveLength(1);
    });
  });
});
