import * as React from 'react';
import {extractContext, normalizeVisit} from '../utilities';

describe('react-traverse-jsx', () => {
  describe('utilities', () => {
    describe('extractContext', () => {
      const ctx = React.createContext({foo: 'foo'});

      it('does not return null for a Provider', () => {
        const provider = <ctx.Provider value={{foo: 'foo'}} />;
        expect(extractContext(provider)).not.toBe(null);
      });

      it('does not return null for a Consumer', () => {
        const consumer = <ctx.Consumer>{() => <span />}</ctx.Consumer>;
        expect(extractContext(consumer)).not.toBe(null);
      });

      it('returns null for an html element', () => {
        expect(extractContext(<span />)).toBeUndefined();
      });
    });

    describe('normalizeVisit', () => {
      it('renders a Component with instance state', () => {
        class Foo extends React.Component {
          state = {
            foo: 'foo',
          };

          render() {
            return <span>{this.state.foo}</span>;
          }
        }

        const el = <Foo />;
        const visit = normalizeVisit(el, null);

        expect(visit.render()).toMatchObject(<span>foo</span>);
      });

      it('renders a Component with passed in context', () => {
        // eslint-disable-next-line react/prefer-stateless-function
        class Foo extends React.Component {
          render() {
            return <span>{this.context.foo}</span>;
          }
        }

        const el = <Foo />;
        const visit = normalizeVisit(el, {foo: 'foo'});

        expect(visit.render()).toMatchObject(<span>foo</span>);
      });

      it('renders a forwardRef', () => {
        const Foo = React.forwardRef<{}, {foo: string}>(props => (
          <span>{props.foo}</span>
        ));
        const el = <Foo foo="foo" />;
        const visit = normalizeVisit(el, null);

        expect(visit.render()).toMatchObject(<span>foo</span>);
      });

      it('renders a class with childContext', () => {
        class Foo extends React.Component {
          getChildContext() {
            return {
              foo: 'foo',
            };
          }

          render() {
            return <span>foo</span>;
          }
        }
        const el = <Foo />;
        const visit = normalizeVisit(el, null);

        expect(visit.childContext).toMatchObject({foo: 'foo'});
      });
    });
  });
});
