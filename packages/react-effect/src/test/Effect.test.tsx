import * as React from 'react';
import {mount} from 'enzyme';

import Effect from '../Effect';
import {METHOD_NAME} from '../extractable';

describe('<Effect />', () => {
  it('calls perform() on componentDidMount', () => {
    const spy = jest.fn();
    mount(<Effect clientOnly perform={spy} />);
    expect(spy).toHaveBeenCalled();
  });

  it('does not call perform() on componentDidMount for serverOnly', () => {
    const spy = jest.fn();
    mount(<Effect serverOnly perform={spy} />);
    expect(spy).not.toHaveBeenCalled();
  });

  it('calls perform() during extraction', () => {
    const spy = jest.fn();
    const effect = mount(<Effect serverOnly perform={spy} />);
    simulateExtractCall(effect, true);
    expect(spy).toHaveBeenCalled();
  });

  it('does not call perform() during extraction for clientOnly', () => {
    const spy = jest.fn();
    const effect = mount(<Effect clientOnly perform={spy} />);
    simulateExtractCall(effect);
    // We still have the one for didMount
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('does not call perform() when extraction passes false', () => {
    const spy = jest.fn();
    const effect = mount(<Effect serverOnly perform={spy} />);
    simulateExtractCall(effect, false);
    expect(spy).not.toHaveBeenCalled();
  });

  it('does not call perform() when extraction passes an array of symbols to include and there is no kind on the effect', () => {
    const kind = Symbol('kind');
    const spy = jest.fn();
    const effect = mount(<Effect serverOnly perform={spy} />);
    simulateExtractCall(effect, [kind]);
    expect(spy).not.toHaveBeenCalled();
  });

  it('does not call perform() when extraction passes a non-matching array of symbols to include', () => {
    const kind = Symbol('kind');
    const include = Symbol('include');
    const spy = jest.fn();
    const effect = mount(<Effect serverOnly kind={kind} perform={spy} />);
    simulateExtractCall(effect, [include]);
    expect(spy).not.toHaveBeenCalled();
  });

  it('calls perform() when extraction passes a matching array of symbols to include', () => {
    const kind = Symbol('kind');
    const spy = jest.fn();
    const effect = mount(<Effect serverOnly kind={kind} perform={spy} />);
    simulateExtractCall(effect, [kind]);
    expect(spy).toHaveBeenCalled();
  });
});

function simulateExtractCall(
  tree: ReturnType<typeof mount>,
  argument: boolean | symbol[] = true,
) {
  (tree.instance() as Effect)[METHOD_NAME](argument);
}
