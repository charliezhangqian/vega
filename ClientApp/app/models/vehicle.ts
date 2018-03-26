import { KeyValuePair } from './vehicle';

export interface KeyValuePair {
    id: number;
    name: string;
}

export interface Make {
    id: number;
    name: string;
    models: KeyValuePair[]
}

