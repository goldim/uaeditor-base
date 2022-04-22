import { IProperty } from "./property";

export interface IProperties {
    addProperty(name: string, value: string): void;
    hasProperty(name:string): boolean;
    getProperty(name:string): IProperty;
    getProperties(): IProperty[];
}