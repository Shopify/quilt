export interface NextFunction {
  (): Promise<any>;
}

export interface AuthConfig {
  secret: string;
  apiKey: string;
  accessMode: 'online' | 'offline';
}

export interface Options extends AuthConfig {
  prefix?: string;
  scopes?: string[];
}
