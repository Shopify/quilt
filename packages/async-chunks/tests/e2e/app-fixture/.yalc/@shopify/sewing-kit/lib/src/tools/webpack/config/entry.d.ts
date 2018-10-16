import { Workspace } from '../../../workspace';
export default function entry({ env, project, paths, config }: Workspace): string | string[] | {
    [key: string]: string | string[];
};
