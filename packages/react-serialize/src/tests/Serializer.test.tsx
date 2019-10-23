import React from 'react';
import serialize from 'serialize-javascript';
import {mount} from '@shopify/react-testing';

import Serializer from '../Serializer';
import {serializedID} from '../utilities';

describe('<Serializer />', () => {
  const id = 'MyData';

  it('generates a script tag with a JSON content type', () => {
    const serializer = mount(<Serializer id={id} data={{}} />);
    expect(serializer).toContainReactComponentTimes('script', 1, {
      type: 'text/json',
    });
  });

  describe('id', () => {
    it('is used as part of the ID for the script', () => {
      const serializer = mount(<Serializer id={id} data={{}} />);
      expect(serializer.find('script')!.prop('id')).toBe(serializedID(id));
    });
  });

  describe('data', () => {
    it('serializes the content as the child contents of the script tag', () => {
      const data = {
        foo: {bar: {baz: 'window.location = "http://dangerous.com"'}},
      };

      const serializer = mount(<Serializer id={id} data={data} />);
      expect(
        serializer.find('script')!.prop('dangerouslySetInnerHTML'),
      ).toHaveProperty('__html', serialize(data));
    });
  });

  describe('details', () => {
    it('does not include a data attribute with details if none are passed', () => {
      const serializer = mount(<Serializer id={id} data={{}} />);
      expect(
        serializer.find('script')!.data('serialized-details'),
      ).toBeUndefined();
    });

    it('includes a data attribute with the serialized details', () => {
      const details = {
        foo: {bar: {baz: 'window.location = "http://dangerous.com"'}},
      };

      const serializer = mount(
        <Serializer id={id} data={{}} details={details} />,
      );
      expect(serializer.find('script')!.data('serialized-details')).toBe(
        serialize(details),
      );
    });
  });
});
