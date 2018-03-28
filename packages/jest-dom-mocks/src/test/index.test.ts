import {timer, clock} from '../index';
import Timer from '../timer';
import Clock from '../clock';

describe('jest-dom-mocks', () => {
  it('exports an instance of the Timer object', () => {
    expect(timer).toBeInstanceOf(Timer);
  });

  it('exports an instance of the Clock object', () => {
    expect(clock).toBeInstanceOf(Clock);
  });
});
