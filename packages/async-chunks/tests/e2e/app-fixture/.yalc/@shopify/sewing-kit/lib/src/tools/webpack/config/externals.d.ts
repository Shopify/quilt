import { Workspace } from '../../../workspace';
export default function externals({ env, config }: Workspace): any[] | {
    [key: string]: string;
} | null;
