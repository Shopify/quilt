import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  isReactElement,
  isPortal,
  isForwardRef,
  isScalar,
  isClassComponent,
} from '../identifiers';

describe('react-traverse-jsx', () => {
  describe('identifiers', () => {
    function Foo() {
      return <span>test</span>;
    }

    // eslint-disable-next-line react/prefer-stateless-function
    class FooComponent extends React.Component {}

    // eslint-disable-next-line react/prefer-stateless-function
    class FooPure extends React.PureComponent {}

    describe('isScalar', () => {
      it('returns true for a string', () => {
        expect(isScalar('')).toBe(true);
      });
      it('returns true for a number', () => {
        expect(isScalar(3)).toBe(true);
      });
      it('returns true for null', () => {
        expect(isScalar(null)).toBe(true);
      });
      it('returns true for undefined', () => {
        expect(isScalar(undefined)).toBe(true);
      });
      it('returns true for true', () => {
        expect(isScalar(true)).toBe(true);
      });
      it('returns true for false', () => {
        expect(isScalar(false)).toBe(true);
      });
      it('returns false for an array', () => {
        expect(isScalar([])).toBe(false);
      });
      it('returns false for an object', () => {
        expect(isScalar({})).toBe(false);
      });
    });

    describe('isForwardRef', () => {
      it('returns true for a forwardRef', () => {
        React.forwardRef((_, ref) => {
          expect(isForwardRef(ref)).toBe(true);
          return <Foo />;
        });
      });

      it('returns false for a ref', () => {
        const ref = React.createRef();
        expect(isForwardRef(ref)).toBe(false);
      });

      it('returns false for a Component', () => {
        expect(isForwardRef(<Foo />)).toBe(false);
      });

      it('returns false for undefined', () => {
        expect(isForwardRef(undefined)).toBe(false);
      });
    });

    describe('isReactElement', () => {
      it('returns true for html elements', () => {
        const el = <div />;
        expect(isReactElement(el)).toBe(true);
      });

      it('returns true for a Component', () => {
        expect(isReactElement(<Foo />)).toBe(true);
      });

      it('returns false for strings', () => {
        expect(isReactElement('test')).toBe(false);
      });
    });

    describe('isPortal', () => {
      it('returns true for a portal', () => {
        const el = document.createElement('div');
        document.body.appendChild(el);
        const portal = ReactDOM.createPortal(<span>test</span>, el);

        expect(isPortal(portal)).toBe(true);

        document.body.removeChild(el);
      });

      it('returns false for html elements', () => {
        const el = <div />;
        expect(isPortal(el)).toBe(false);
      });

      it('returns false for Component elements', () => {
        expect(isPortal(<Foo />)).toBe(false);
      });
    });

    describe('isClassComponent', () => {
      it('returns true for a Component', () => {
        const el = <FooComponent />;
        expect(isClassComponent(el.type)).toBe(true);
      });

      it('returns true for a PureComponent', () => {
        const el = <FooPure />;
        expect(isClassComponent(el.type)).toBe(true);
      });

      it('returns false for a stateless functional component', () => {
        const el = <Foo />;
        expect(isClassComponent(el.type)).toBe(false);
      });
    });
  });
});
