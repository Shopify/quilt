import React from 'react';
import {mount} from '@shopify/react-testing';

import {getSerialized} from '../utilities';

describe('getSerialized', () => {
  it('gets proper value from serialized script', async () => {
    await mount(
      <div>
        <script type="text/json" data-serialized-id="foo">
          {JSON.stringify({data: 'foo_value'})}
        </script>
      </div>,
    );

    expect(getSerialized('foo')).toBe('foo_value');
  });

  it('throws error when nothing is found', async () => {
    await mount(<div />);

    expect(() => getSerialized('foo')).toThrow(
      'No serializations found for id "foo"',
    );
  });
});
