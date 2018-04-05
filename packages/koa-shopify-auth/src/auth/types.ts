import {Context} from 'koa';

export interface AuthConfig {
  secret: string;
  apiKey: string;
  accessMode: 'online' | 'offline';
  afterAuth(ctx: Context): void;
}

export interface Options extends AuthConfig {
  prefix?: string;
  scopes?: string[];
}
