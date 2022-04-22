import { Users } from './users';
import { IBuilder } from './builder';
import { IComposite } from './icomponent';
import { ILoader } from './loader';
import { OpcObject } from './opc_object';
import { OpcVariable } from './opc_variable';
import { IConfig } from './iconfig';
import { Plugin } from './plugin';
import { Component } from './component';
import { GroupLoader, ObjectLoader, PluginLoader, VariableLoader } from './component_loader';
import { NullPropertyGroup } from './null_property_group';
import { IPropertyGroup, PropertyGroups } from './iproperty_group';
import { PropertyGroup } from './property_group';

export class Config extends Component implements IConfig {
    private users = new Users();
    private groups: PropertyGroups = [];

    constructor(){
        super('root');
    }

    toString(): string {
        return 'root';
    }

    save(): void {
        this.users.save();
        this.groups.forEach(group => group.save());
        this.children.forEach(component => component.save());
    }

    build(builder: IBuilder): void {
        builder.startConfig();
        this.buildServerSection(builder);
        this.buildPluginSection(builder);
        this.buildOpcSection(builder);
        builder.endConfig();
    }

    private buildPluginSection(builder: IBuilder): void {
        builder.startConfigSection('plugins');
        this.getPlugins().forEach(plugin => plugin.build(builder));
        builder.endConfigSection();
    }

    private buildOpcSection(builder: IBuilder): void {
        builder.startConfigSection('opc');
        this.children.forEach(component => component.build(builder));
        builder.endConfigSection();
    }

    private buildServerSection(builder: IBuilder): void {
        builder.startConfigSection('server');
        this.groups.forEach(grp => grp.build(builder));
        this.users.build(builder);
        builder.endConfigSection()
    }

    wasSaved(): boolean {
        const usersSaved = this.users.wasSaved();
        const groupsSaved = this.groups.every(grp => grp.wasSaved());
        const componentsSaved = this.children.every(component => component.wasSaved());
        return usersSaved && groupsSaved && componentsSaved;
    }

    isModified(): boolean {
        const usersChanged = this.users.isModified();
        const groupsChanged = this.groups.some(grp => grp.isModified());
        const componentsChanged = this.children.some(component => component.isModified());
        return super.isModified() || usersChanged || groupsChanged || componentsChanged;
    }

    getUsers(): Users {
        return this.users;
    }

    getPlugins(): Plugin[] {
        return this.children.filter(component => component instanceof Plugin) as Plugin[];
    }

    getPropertyGroup(name: string): IPropertyGroup {
        const found = this.groups.find(grp => grp.Name === name);
        return found ? found: new NullPropertyGroup();
    }

    getChild(id: string): IComposite {
        const SEPARATOR = '/';
        const shortIds = id.split(SEPARATOR);

        let currentShortId = shortIds.shift();
        let res = null;

        if (currentShortId){
            res = this.searchChildTopLevel(currentShortId);
            while (res){
                currentShortId = shortIds.shift();
                if (currentShortId){
                    res = res.getChild(currentShortId);
                } else {
                    break;
                }
            }
        }
        
        return res ? res: this.getNotFoundComponent();
    }

    load(loader: ILoader): void {
        this.loadGroups(loader);
        this.users.load(loader.loadBlock('server'));

        const componentDescriptions = [
            {
                blockName: 'opc',
                className: OpcObject,
                loaderName: ObjectLoader
            },

            {
                blockName: 'plugins',
                className: Plugin,
                loaderName: PluginLoader
            },

            {
                blockName: 'opc',
                className: OpcVariable,
                loaderName: VariableLoader
            },
        ];
        componentDescriptions.forEach(desc => this.loadComponentsWithSection(loader, desc.blockName, desc.className, desc.loaderName));
    }

    private loadGroups(loader: ILoader): void {
        const subloader = loader.loadBlock('server');

        [...subloader.loadComponents(GroupLoader)].forEach(data => {
            this.loadComponent(subloader, PropertyGroup, this.groups);
        });
    }
}