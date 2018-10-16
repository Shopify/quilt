/// <reference types="node" />
import { Server } from 'http';
import { Socket } from 'net';
import Runner from '../../../runner';
export interface ConnectionMap {
    [key: number]: Socket;
}
export default class ListenerManager {
    private name;
    private listener;
    private lastConnectionKey;
    private connectionMap;
    constructor(listener: Server, { name }?: {
        name?: string | undefined;
    });
    killAllConnections(): void;
    dispose({ logger }: Runner): Promise<void>;
}
