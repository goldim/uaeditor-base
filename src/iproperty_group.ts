import { IBuildable } from "./builder";
import { IModifiable } from "./imodifiable";
import { IProperties } from "./iproperties";
import { ISaveable } from "./isaveable";
import { ILoadable } from "./loader";

export interface IPropertyGroup extends IModifiable, ISaveable, IProperties, IBuildable, ILoadable {
    Name: string 
}

export type PropertyGroups = IPropertyGroup[];