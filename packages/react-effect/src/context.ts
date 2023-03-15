import React from 'react';

import type {EffectManager} from './manager';

export const EffectContext = React.createContext<EffectManager | null>(null);
