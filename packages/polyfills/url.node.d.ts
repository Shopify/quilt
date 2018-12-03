/// <reference types="node" />
import { URL, URLSearchParams } from 'url';
declare global {
    namespace NodeJS {
        interface Global {
            URL: typeof URL;
            URLSearchParams: typeof URLSearchParams;
        }
    }
}
