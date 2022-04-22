import { ISaveable } from "./isaveable";
import { IModifiable } from './imodifiable';
import { IBuildable, IBuilder } from "./builder";
import { ILoadable, ILoader } from "./loader";
import { NullProperty } from "./null_property";
import { PropertyLoader } from "./component_loader";

export interface IProperty {
    readonly Name: string;
    Value: string;
    Required: boolean;
}

export class Property implements IProperty, IModifiable, ISaveable, IBuildable, ILoadable {
    private name: string;
    private value: string;
    private required = false;

    private saved = false;
    private modified = false;

    constructor(name: string, value: string, required = false){
        this.name = name;
        this.value = value;
        this.required = required;
    }

    get Name(): string {
        return this.name;
    }

    get Value(): string {
        return this.value;
    }

    set Value(value: string) {
        this.value = value;
        this.modified = true;
    }

    get Required(): boolean {
        return this.required;
    }

    build(builder: IBuilder): void {
        builder.buildProperty(this.Name, this.Value);
    }

    load(loader: ILoader): void {
        const option = loader.loadComponent(PropertyLoader);
        this.name = option.get('name');
        this.value = option.get('value');
    }

    save(): void {
        this.saved = true;
        this.modified = false;
    }

    wasSaved(): boolean {
        return this.saved;
    }

    isModified(): boolean {
        return this.modified;
    }

    static getNotFoundProperty(): IProperty {
        return new NullProperty();
    }
}