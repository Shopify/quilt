import {Logger} from './Logger';
import {ConsoleFormatter} from './formatters';

export * from './Logger';
export * from './formatters';
export * from './types';

const logger = new Logger({
  name: 'fred',
  formatter: new ConsoleFormatter(),
});

logger.error(new Error('foo'));
