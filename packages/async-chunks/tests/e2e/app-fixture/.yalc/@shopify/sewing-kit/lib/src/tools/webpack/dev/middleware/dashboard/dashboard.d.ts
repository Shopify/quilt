import { RequestHandler } from 'express';
import AppClient from '../../client';
import { Workspace } from '../../../../../workspace';
import Runner from '../../../../../runner';
import StreamManager from '../../server-sent-event-stream-manager';
export declare type ClientState = 'compile' | 'compile-failed' | 'compile-error' | 'done';
export interface ClientAsset {
    url: string;
    filename: string;
}
interface Client {
    state: ClientState | null;
    assets: ClientAsset[] | null;
}
export interface State {
    client: Client;
    assetsBaseUrl: string | null;
}
export default class Dashboard {
    private workspace;
    private runner;
    state: State;
    streamManager: StreamManager | null;
    constructor(workspace: Workspace, runner: Runner);
    middleware(publicPath: string): RequestHandler;
    listenToClient(client: AppClient): void;
    sendStatus(status: {
        [key: string]: any;
    }): void;
    parseAssetPath(path: string): string;
    end(): Promise<void>;
}
export {};
