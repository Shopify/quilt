import { Request, Response } from 'express';
import { Stats } from 'webpack';
export default class FileNotFound {
    private publicPath;
    private assets;
    constructor(publicPath: string);
    update(stats: Stats): void;
    middleware: (request: Request, response: Response) => void;
}
