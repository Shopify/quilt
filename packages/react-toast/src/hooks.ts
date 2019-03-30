import * as React from 'react';
import {Context} from './context';

export const useToasts = () => React.useContext(Context);
