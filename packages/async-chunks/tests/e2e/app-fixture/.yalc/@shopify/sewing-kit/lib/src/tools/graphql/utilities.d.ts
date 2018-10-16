import { Workspace } from '../../workspace';
export interface Schema {
    [key: string]: any;
}
export declare function loadSchema(endpoint: string): Promise<Schema>;
export declare function loadProductionSchema(endpoint: string): Promise<Schema>;
export declare function getUnionsAndInterfacesFromInstrospection(introspection: any): any;
export declare function graphQLUnionAndInterfacesPath(workspace: Workspace): string;
