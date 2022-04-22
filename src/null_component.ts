import { IBuilder } from "./builder";
import { Composites, IComposite } from "./icomponent";
import { ILoader } from "./loader";
import { IProperty } from "./property";
import { NullProperty } from "./null_property";

export class NullComponent implements IComposite {
    toString(): string {
        return '';
    }

    set Id(id: string){
    }

    add(child: IComposite): void {
    }

    remove(id: string): void {
    }

    getChild(id: string): IComposite {
        return new NullComponent();
    }

    hasChild(id: string): boolean {
        return false;
    }

    getChildren(): Composites {
        return [];
    }

    wasSaved(): boolean {
        return false;
    }

    save(): void {
    }

    isModified(): boolean {
        return false;
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

    load(loader: ILoader): void {
    }
}