export declare function ifElse<T, S = undefined>(condition: boolean, then: T, otherwise?: S): T | S | undefined;
export declare function flatten(array: any[]): any[];
export declare function removeEmptyValues<T extends {
    [key: string]: any;
}>(obj: T): object;
export declare function removeEmptyStringValues(obj: {
    [key: string]: string | undefined | null;
}): {
    [key: string]: string;
};
export declare function msToMinutesAndSeconds(ms: number): string;
