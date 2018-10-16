/// <reference types="node" />
import * as webpack from 'webpack';
import { EventEmitter } from 'events';
import Dashboard from './middleware/dashboard';
import { Workspace } from '../../../workspace';
import Runner from '../../../runner';
export interface Options {
    lazy: boolean;
    hot: boolean;
    logReactUpdates: boolean;
}
export default class Client extends EventEmitter {
    private config;
    private workspace;
    private dashboard;
    private runner;
    private options;
    private webpackDevMiddleware;
    private listenerManager;
    constructor(config: webpack.Configuration, workspace: Workspace, dashboard: Dashboard, runner: Runner, options?: Partial<Options>);
    on(event: 'done', handler: (stats: webpack.Stats) => void): this;
    on(event: 'compile', handler: () => void): this;
    on(event: 'compile-error', handler: (stats: webpack.Stats) => void): this;
    on(event: 'compile-failed', handler: (error: Error) => void): this;
    emit(event: 'done', payload: webpack.Stats): boolean;
    emit(event: 'compile'): boolean;
    emit(event: 'compile-error', stats: webpack.Stats): boolean;
    emit(event: 'compile-failed', error: Error): boolean;
    run(): Promise<void>;
    dispose(): Promise<void>;
}
