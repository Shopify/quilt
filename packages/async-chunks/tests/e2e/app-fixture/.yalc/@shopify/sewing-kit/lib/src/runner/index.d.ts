import { Workspace } from '../workspace';
import Logger, { Message, Verbosity } from './logger';
export { Logger, Message, Verbosity };
export default class Runner {
    logger: Logger;
    private performed;
    constructor(logger?: Logger);
    fail(): never;
    end(): never;
    hasPerformed(task: Symbol, workspace?: Workspace): boolean;
    perform(task: Symbol, workspace?: Workspace): void;
}
