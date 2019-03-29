import * as React from 'react';
import {createPortal} from 'react-dom';
import {mount} from '../api';

describe('e2e', () => {
  it('can test the result of triggering props', () => {
    function Clickable({onClick}: {onClick(): void}) {
      return (
        <button type="button" onClick={onClick}>
          Click me
        </button>
      );
    }

    function MyComponent() {
      const [clicked, setClicked] = React.useState(false);

      return clicked ? (
        <div>Clicked!</div>
      ) : (
        <Clickable onClick={setClicked.bind(null, true)} />
      );
    }

    const myComponent = mount(<MyComponent />);
    myComponent.find(Clickable)!.trigger('onClick');
    expect(myComponent.text()).toContain('Clicked!');
  });

  it('can traverse through portals', () => {
    function Portal({children}: {children: React.ReactNode}) {
      const [mounted, setMounted] = React.useState(false);
      const element = React.useRef<HTMLElement | null>(null);

      React.useEffect(() => {
        if (!mounted) {
          element.current = document.createElement('div');
          document.body.appendChild(element.current);
          setMounted(true);
        }

        return () => {
          if (element.current != null) {
            element.current.remove();
          }
        };
      });

      return element.current ? createPortal(children, element.current) : null;
    }

    function MyComponent() {
      return <div>Hello world!</div>;
    }

    const portal = mount(
      <Portal>
        <MyComponent />
      </Portal>,
    );

    expect(portal.find(MyComponent)).not.toBeNull();
  });

  it('can traverse through context providers and consumers', () => {
    const MessageContext = React.createContext<string>('');

    function Message({children}: {children: React.ReactNode}) {
      return <div>{children}</div>;
    }

    function MyComponent() {
      return (
        <MessageContext.Consumer>
          {message => <Message>{message}</Message>}
        </MessageContext.Consumer>
      );
    }

    const message = 'Hello world';
    const myComponent = mount(
      <MessageContext.Provider value={message}>
        <MyComponent />
      </MessageContext.Provider>,
    );

    expect(myComponent.find(Message)!.text()).toBe(message);
  });

  it('can traverse through function React.memo components', () => {
    function Message({children}: {children: React.ReactNode}) {
      return <div>{children}</div>;
    }

    const MyComponent = React.memo(() => <Message>Hello world</Message>);

    const myComponent = mount(<MyComponent />);

    expect(myComponent.find(Message)!.text()).toBe('Hello world');
    expect(myComponent.text()).toBe(myComponent.find(Message)!.text());
  });

  it('can traverse through class React.memo components', () => {
    function Message({children}: {children: React.ReactNode}) {
      return <div>{children}</div>;
    }

    const MyComponent = React.memo(
      // eslint-disable-next-line react/prefer-stateless-function
      class MyComponent extends React.Component {
        render() {
          return <Message>Hello world</Message>;
        }
      },
    );

    const myComponent = mount(<MyComponent />);

    expect(myComponent.find(Message)!.text()).toBe('Hello world');
    expect(myComponent.text()).toBe(myComponent.find(Message)!.text());
  });

  it('can traverse through pure components', () => {
    function Message({children}: {children: React.ReactNode}) {
      return <div>{children}</div>;
    }

    // eslint-disable-next-line react/prefer-stateless-function
    class MyComponent extends React.PureComponent {
      render() {
        return <Message>Hello world</Message>;
      }
    }

    const myComponent = mount(<MyComponent />);

    expect(myComponent.find(Message)!.text()).toBe('Hello world');
    expect(myComponent.text()).toBe(myComponent.find(Message)!.text());
  });

  it('can traverse through fragments', () => {
    function Message({children}: {children: React.ReactNode}) {
      return <div>{children}</div>;
    }

    function MyComponent() {
      return (
        <>
          <div>Message is:</div>
          <Message>Hello world</Message>
        </>
      );
    }

    const myComponent = mount(<MyComponent />);

    expect(myComponent.find(Message)!.text()).toBe('Hello world');
    expect(myComponent.text()).toContain(myComponent.find(Message)!.text());
  });

  it('can traverse through forwardRefs', () => {
    function Message({children}: {children: React.ReactNode}) {
      return <div>{children}</div>;
    }

    const MyComponent = React.forwardRef<HTMLDivElement, {}>(
      function MyComponent(_props: {}, ref: React.Ref<HTMLDivElement>) {
        return (
          <>
            <div ref={ref}>Message is:</div>
            <Message>Hello world</Message>
          </>
        );
      },
    );

    const myComponent = mount(<MyComponent />);

    expect(myComponent.find(Message)!.text()).toBe('Hello world');
    expect(myComponent.text()).toContain(myComponent.find(Message)!.text());
  });
});
