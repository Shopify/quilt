import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {isReactElement, isPortal} from '../identifiers';

describe('react-infuse', () => {
  describe('isReactElement', () => {
    it('returns true for html elements', () => {
      const el = <div />;
      expect(isReactElement(el)).toBe(true);
    });
    it('returns true for Components elements', () => {
      function Foo() {
        return <span>test</span>;
      }
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
  });
});
