import * as React from 'react';
import {infuse} from '..';

describe('react-traverse-nodes', () => {
  describe('index', () => {
    it('calls the infuser', async () => {
      const tree = <div>hello</div>;
      const infuser = jest.fn();
      await infuse(tree, infuser, null);
      expect(infuser).toHaveBeenCalled();
    });

    it('calls the infuser with an initialized nested class instance', async () => {
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
      function infuser(_, instance) {
        if (instance instanceof World) {
          extracted = instance.extractMe;
        }
      }
      await infuse(tree, infuser, null);
      expect(extracted).toBe(42);
    });
  });
});
