import * as React from 'react';
import serializeJavaScript from 'serialize-javascript';
import {mount} from '@shopify/react-testing';

import Serialize from '../Serialize';
import {SERIALIZE_ATTRIBUTE} from '../../../utilities';

describe('<Serialize />', () => {
  const id = 'MyData';

  it('generates a script tag with a JSON content type', () => {
    const serialize = mount(<Serialize id={id} data={{}} />);
    expect(serialize).toContainReactComponent('script', {type: 'text/json'});
  });

  describe('id', () => {
    it('is used as the serialize attribute for the script', () => {
      const serialize = mount(<Serialize id={id} data={{}} />);
      expect(serialize.find('script')!.data(SERIALIZE_ATTRIBUTE)).toBe(id);
    });
  });

  describe('data', () => {
    it('serializes the content as the child contents of the script tag', () => {
      const data = {
        foo: {bar: {baz: 'window.location = "http://dangerous.com"'}},
      };

      const serialize = mount(<Serialize id={id} data={data} />);

      expect(serialize).toContainReactComponent('script', {
        dangerouslySetInnerHTML: {__html: serializeJavaScript(data)},
      });
    });
  });
});
