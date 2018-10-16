/// <reference types="node" />
import { EventEmitter } from 'events';
import * as webpack from 'webpack';
import { Workspace } from '../../../workspace';
export default class Client extends EventEmitter {
    private entryPoint;
    private workspace;
    constructor(entryPoint: string, workspace: Workspace);
    on(event: 'done', handler: (stats: webpack.Stats) => void): this;
    on(event: 'compile', handler: () => void): this;
    emit(event: 'done', payload: webpack.Stats): boolean;
    emit(event: 'compile'): boolean;
    run(): Promise<{
        host: string;
        port: number;
    }>;
}
