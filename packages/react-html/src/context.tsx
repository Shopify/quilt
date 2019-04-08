import * as React from 'react';
import {HtmlManager} from './manager';

export const HtmlContext = React.createContext(new HtmlManager());
