import {timer, clock, animationFrame, location} from '../index';
import Timer from '../timer';
import Clock from '../clock';
import AnimationFrame from '../animation-frame';
import Location from '../location';

describe('jest-dom-mocks', () => {
  it('exports an instance of the Timer object', () => {
    expect(timer).toBeInstanceOf(Timer);
  });

  it('exports an instance of the Clock object', () => {
    expect(clock).toBeInstanceOf(Clock);
  });

  it('exports an instance of the AnimationFrame object', () => {
    expect(animationFrame).toBeInstanceOf(AnimationFrame);
  });

  it('exports an instance of the Location object', () => {
    expect(location).toBeInstanceOf(Location);
  });
});
