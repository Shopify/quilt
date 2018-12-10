import '@babel/polyfill';
import {auto as unhandledRejectionPolyfill} from 'browser-unhandled-rejection';

import './fetch';

unhandledRejectionPolyfill();
