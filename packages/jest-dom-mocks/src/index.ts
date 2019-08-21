import AnimationFrame from './animation-frame';
import RequestIdleCallback from './request-idle-callback';
import Clock from './clock';
import fetch from './fetch';
import Location from './location';
import MatchMedia from './match-media';
import Storage from './storage';
import Timer from './timer';
import UserTiming from './user-timing';
import IntersectionObserver from './intersection-observer';
import Promise from './promise';
import Dimension from './dimension';

export const animationFrame = new AnimationFrame();
export const requestIdleCallback = new RequestIdleCallback();

export const clock = new Clock();

export {fetch};

export const location = new Location();

export const matchMedia = new MatchMedia();
export {mediaQueryList} from './match-media';

export const localStorage = new Storage();
export const sessionStorage = new Storage();

export const timer = new Timer();
export const userTiming = new UserTiming();
export const intersectionObserver = new IntersectionObserver();
export const promise = new Promise();

export const dimension = new Dimension();

export function installMockStorage() {
  if (typeof window !== 'undefined') {
    Object.defineProperties(window, {
      localStorage: {
        value: localStorage,
      },
      sessionStorage: {
        value: sessionStorage,
      },
    });
  }
}

const mocksToEnsureReset = {
  clock,
  location,
  timer,
  promise,
  animationFrame,
  fetch,
  matchMedia,
  userTiming,
  intersectionObserver,
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
