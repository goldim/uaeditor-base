import { IProperty } from "./property";
import { IBuilder } from './builder';
import { ILoader } from './loader';
import { NullProperty } from './null_property';
import { IPropertyGroup } from './iproperty_group';

export class NullPropertyGroup implements IPropertyGroup {
    constructor(id = ''){
    }

    get Name(): string {
        return '';
    }

    set Name(name: string){
    }

    isModified(): boolean {
        return false;
    }

    wasSaved(): boolean {
        return false;
    }

    save(): void {
    }

    load(loader: ILoader): void {
    }

    addProperty(name: string, value: string): void {
    }

    hasProperty(name:string): boolean {
        return false;
    }

    getProperty(name:string): IProperty {
        return new NullProperty();
    }

    getProperties(): IProperty[] {
        return [];
    }

    build(builder: IBuilder): void {
    }
}