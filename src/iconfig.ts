import { IComposite } from "./icomponent";
import { IPropertyGroup } from "./iproperty_group";
import { Plugin } from "./plugin";
import { Users } from "./users";

export interface IConfig extends IComposite {
    getUsers(): Users;
    getPropertyGroup(name: string): IPropertyGroup;
    getPlugins(): Plugin[];
}