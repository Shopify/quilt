import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {traverse} from '..';

describe('react-traverse-nodes', () => {
  describe('index', () => {
    it('calls the visitor', async () => {
      const tree = <div>hello</div>;
      const visit = jest.fn();
      await traverse(tree, visit, null);
      expect(visit).toHaveBeenCalled();
    });

    it('calls the visitor with an initialized nested class instance', async () => {
      class World extends React.Component {
        extractMe = 3;
        constructor(props) {
          super(props);
          this.extractMe = 42;
        }
        render() {
          return 'world';
        }
      }
      const tree = (
        <div>
          hello <World />
        </div>
      );
      let extracted = 0;
      function visit(_, instance) {
        if (instance instanceof World) {
          extracted = instance.extractMe;
        }
      }
      await traverse(tree, visit, null);
      expect(extracted).toBe(42);
    });

    it('calls the visitor with portal nodes', async () => {
      const modalElem = document.createElement('div');
      document.body.appendChild(modalElem);

      // eslint-disable-next-line react/prefer-stateless-function
      class ModalContent extends React.Component {
        render() {
          return <span>hello modal</span>;
        }
      }
      class Modal extends React.Component {
        render() {
          return ReactDOM.createPortal(
            <span>
              <ModalContent />
            </span>,
            modalElem,
          );
        }
      }

      const tree = <Modal />;
      expect.assertions(1);
      function visit(el) {
        if (typeof el === 'string') {
          expect(el).toBe('hello modal');
        }
      }
      await traverse(tree, visit, null);
      document.body.removeChild(modalElem);
    });

    it('calls the visitor with added context', async () => {
      const {Provider, Consumer} = React.createContext({foo: ''});

      const tree = (
        <Provider value={{foo: 'foo'}}>
          <Consumer>
            {ctx => {
              return <span>{ctx.foo}</span>;
            }}
          </Consumer>
        </Provider>
      );
      expect.assertions(1);
      function visit(el) {
        if (typeof el === 'string') {
          expect(el).toBe('foo');
        }
      }
      await traverse(tree, visit, null);
    });
  });
});
