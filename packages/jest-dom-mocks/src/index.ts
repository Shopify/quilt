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

const mocksToEnsureReset = {
  clock,
  location,
  timer,
  animationFrame,
  fetch,
  matchMedia,
};

export function ensureMocksReset() {
  for (const mockName of Object.keys(mocksToEnsureReset)) {
    if (mocksToEnsureReset[mockName].isMocked()) {
      throw new Error(
        `You did not reset the mocked ${mockName}. Make sure to call ${mockName}.restore() after your tests have run.`,
      );
    }
  }

  localStorage.restore();
  sessionStorage.restore();
}
