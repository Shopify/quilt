import {Client} from '@bugsnag/js';

export type ErrorLogger = Pick<Client, 'notify' | 'leaveBreadcrumb'>;
