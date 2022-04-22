import { ISaveable } from "./isaveable";
import { IModifiable } from './imodifiable';
import { IBuildable, IBuilder } from "./builder";
import { ILoadable, ILoader } from "./loader";
import { IProperty } from "./property";

export class NullProperty implements IProperty, IModifiable, ISaveable, IBuildable, ILoadable {
    get Name(): string {
        return '';
    }

    get Value(): string {
        return '';
    }

    set Value(value: string) {
    }

    get Required(): boolean {
        return false;
    }

    build(builder: IBuilder): void {
    }

    load(loader: ILoader): void {
    }

    save(): void {
    }

    wasSaved(): boolean {
        return false;
    }

    isModified(): boolean {
        return false;
    }
}