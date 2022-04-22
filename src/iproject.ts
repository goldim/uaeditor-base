import { IConfig } from "./iconfig";
import { IModifiable } from "./imodifiable";
import { ISaveable } from "./isaveable";

export interface IProject extends ISaveable, IModifiable {
    get Config(): IConfig;
    Path: string;

    open(): void;
    close(): void;

    isOpened(): boolean;
}