/// <reference types="node" />
import { EventEmitter } from 'events';
import * as webpack from 'webpack';
import Runner from '../../../runner';
import Client from './client';
import Warmup from './warmup';
export interface Options {
    debug: boolean;
}
export default class Server extends EventEmitter {
    private config;
    private client;
    private warmup;
    private runner;
    private options;
    private clientIsCompiling;
    private startServerIsQueued;
    private isDisposing;
    private hasStarted;
    private lastClientStats;
    private watcher;
    private server;
    constructor(config: webpack.Configuration, client: Client, warmup: Warmup, runner: Runner, options?: Partial<Options>);
    run(): Promise<void>;
    on(event: 'compile', handler: () => void): this;
    on(event: 'compile-error', handler: (stats: webpack.Stats, lastClientStats: webpack.Stats) => void): this;
    on(event: 'compile-failed', handler: (error: Error) => void): this;
    on(event: 'done', handler: (stats: webpack.Stats) => void): this;
    emit(event: 'compile-error', stats: webpack.Stats, lastClientStats: webpack.Stats | null): boolean;
    emit(event: 'compile-failed', error: Error): boolean;
    emit(event: 'compile'): boolean;
    emit(event: 'done', payload: webpack.Stats): boolean;
    dispose(): Promise<void>;
    private startServer;
    private killServer;
}
