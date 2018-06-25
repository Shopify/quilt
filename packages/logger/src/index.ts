import {Logger} from './Logger';
import {ConsoleFormatter} from './formatters';

const logger = new Logger({
  name: 'logger',
  formatter: new ConsoleFormatter(),
});

logger.info('starting application...');
logger.warn('You must provide adequate data');
logger.error(new Error('Could not find `data.someKey`'));
