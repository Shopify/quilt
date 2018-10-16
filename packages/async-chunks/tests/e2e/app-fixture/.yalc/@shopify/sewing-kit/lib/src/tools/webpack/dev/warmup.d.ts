import { Workspace } from '../../../workspace';
import Runner from '../../../runner';
import Client from './client';
import Server from './server';
export default class Warmup {
    private workspace;
    private runner;
    private streamManager;
    private lastStatus;
    constructor(workspace: Workspace, runner: Runner);
    start(): void;
    sendStatus(status: {
        [key: string]: any;
    }): void;
    listenToClient(client: Client): void;
    listenToServer(server: Server): void;
    end(): Promise<void>;
}
