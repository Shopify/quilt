import React from 'react';
import {EffectManager} from './manager';

export const EffectContext = React.createContext<EffectManager | null>(null);
