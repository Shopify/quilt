import AnimationFrame from './animation-frame';
import Clock from './clock';
import fetch from './fetch';
import Location from './location';
import MatchMedia from './match-media';
import Storage from './storage';
import Timer from './timer';

export const animationFrame = new AnimationFrame();

export const clock = new Clock();

export {fetch};

export const location = new Location();

export const matchMedia = new MatchMedia();
export {mediaQueryList} from './match-media';

export const localStorage = new Storage();
export const sessionStorage = new Storage();

export const timer = new Timer();

export function ensureMocksReset() {
  if (clock.isMocked()) {
    throw new Error(
      'You did not reset the fake clock. Make sure to call clock.restore() after your tests have run.',
    );
  }

  if (location.isMocked()) {
    throw new Error(
      'You did not reset the fake location. Make sure to call location.restore after your tests have run.',
    );
  }

  if (timer.isMocked()) {
    throw new Error(
      'You did not reset the fake timers. Make sure to call timer.restore() after your tests have run.',
    );
  }

  if (animationFrame.isMocked()) {
    throw new Error(
      'You did not reset the fake animation frame. Make sure to call animationFrame.restore() after your tests have run.',
    );
  }

  if (fetch.isMocked()) {
    throw new Error(
      'You did not reset the fake fetch. Make sure to call fetchMock.restore() after your tests have run.',
    );
  }

  localStorage.restore();
  sessionStorage.restore();
}
