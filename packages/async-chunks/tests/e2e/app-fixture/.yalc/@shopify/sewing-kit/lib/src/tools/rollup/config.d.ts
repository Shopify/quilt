import * as rollup from 'rollup';
import { Workspace } from '../../workspace';
export declare function createInputConfig({ config }: Workspace): rollup.Options;
export declare function createOutputConfig({ config }: Workspace): rollup.WriteOptions;
