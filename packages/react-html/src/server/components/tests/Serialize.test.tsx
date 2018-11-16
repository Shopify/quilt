import * as React from 'react';
import {shallow} from 'enzyme';
import serializeJavaScript from 'serialize-javascript';

import Serialize from '../Serialize';
import {SERIALIZE_ATTRIBUTE} from '../../../utilities';

describe('<Serialize />', () => {
  const id = 'MyData';

  it('generates a script tag with a JSON content type', () => {
    const serialize = shallow(<Serialize id={id} data={{}} />);
    expect(serialize.find('script')).toHaveLength(1);
    expect(serialize.find('script').prop('type')).toBe('text/json');
  });

  describe('id', () => {
    it('is used as the serialize attribute for the script', () => {
      const serialize = shallow(<Serialize id={id} data={{}} />);
      expect(serialize.find('script').prop(SERIALIZE_ATTRIBUTE)).toBe(id);
    });
  });

  describe('data', () => {
    it('serializes the content as the child contents of the script tag', () => {
      const data = {
        foo: {bar: {baz: 'window.location = "http://dangerous.com"'}},
      };

      const serialize = shallow(<Serialize id={id} data={data} />);
      expect(
        serialize.find('script').prop('dangerouslySetInnerHTML'),
      ).toHaveProperty('__html', serializeJavaScript(data));
    });
  });
});
