/// <reference types="node" />
import { Server } from 'http';
export declare function runBuild(fixtureDir: string, options?: {
    [key: string]: string;
}): void;
export declare function runClientBuild(fixtureDir: string, options?: {
    [key: string]: string;
}): void;
export declare function runServerBuild(fixtureDir: string, options?: {
    [key: string]: string;
}): void;
export declare function runFixtureServer(fixtureBuildPath: string, port: number): Server;
export declare function yarnInstall(fixtureDir: string): void;
