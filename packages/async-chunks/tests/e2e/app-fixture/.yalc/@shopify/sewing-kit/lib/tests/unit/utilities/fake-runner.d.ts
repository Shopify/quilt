import Runner from '../../../src/runner';
export declare class FakeRunner extends Runner {
    private _ended;
    private _failed;
    constructor(enableDebug?: boolean);
    readonly output: string;
    readonly ended: boolean;
    readonly failed: boolean;
    setEnded(): void;
    setFailed(): void;
}
