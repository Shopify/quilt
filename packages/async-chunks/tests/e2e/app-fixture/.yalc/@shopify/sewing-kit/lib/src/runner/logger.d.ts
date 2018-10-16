export declare enum Verbosity {
    debug = "debug",
    info = "info",
    warn = "warn",
    error = "error"
}
export declare type Message = string | ((colorizer: any) => string);
export default class Logger {
    private verbosity;
    constructor(verbosity?: Verbosity);
    error(error: Error): void;
    info(message: Message): void;
    warn(message: Message): void;
    debug(message: Message): void;
    private log;
}
