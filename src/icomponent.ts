import { IBuildable } from "./builder";
import { IModifiable } from "./imodifiable";
import { IProperties } from "./iproperties";
import { ISaveable } from "./isaveable";
import { ILoadable } from "./loader";

export type Composites = IComposite[];

export interface IParent {
    hasChild(id: string): boolean;
    getChild(id: string): IComposite;
    getChildren(): Composites;
}

export interface IComponent extends IParent, ISaveable, IBuildable, IModifiable, ILoadable, IProperties {
    Id: string;
    toString(): string;
}

export interface IComposite extends IComponent {
    add(component: IComposite): void;
    remove(id: string): void;
}