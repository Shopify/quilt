/// <reference types="node" />
import { Request, Response } from 'express';
import { Server } from 'http';
import { Socket } from 'net';
import Runner from '../../../runner';
export interface ConnectionMap {
    [key: number]: Socket;
}
export default class ServerSentEventConnectionManager {
    private name;
    private listener;
    private lastConnectionKey;
    private connectionMap;
    constructor(listener: Server, { name }?: {
        name?: string | undefined;
    });
    sendHeaders(request: Request, response: Response): void;
    sendStatus(status: {
        [key: string]: any;
    }): void;
    killAllConnections(): void;
    dispose({ logger }: Runner): Promise<void>;
}
