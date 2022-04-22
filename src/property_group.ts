import { IProperty } from "./property";
import { Properties } from "./properties";
import { IBuilder } from './builder';
import { ILoader } from './loader';
import { GroupLoader } from './component_loader';
import { IPropertyGroup } from './iproperty_group';

export class PropertyGroup implements IPropertyGroup {
    private saved = false;
    private modified = false;
    private name: string;
    private props: Properties;

    constructor(id = ''){
        this.name = id;
        this.props = new Properties();
    }

    get Name(): string {
        return this.name;
    }

    set Name(name: string){
        this.name = name;
        this.modified = true;
    }

    isModified(): boolean {
        return this.modified || this.props.isModified();
    }

    wasSaved(): boolean {
        return this.saved && this.props.wasSaved();
    }

    save(): void {
        this.props.save();
        this.saved = true;
        this.modified = false;
    }

    load(loader: ILoader): void {
        const grp = loader.loadComponent(GroupLoader);
        this.name = grp.get('name');
        this.props.load(loader.createLoader(grp.get('content')));
    }

    addProperty(name: string, value: string): void {
        this.props.addProperty(name, value);
    }

    hasProperty(name:string): boolean {
        return this.props.hasProperty(name);
    }

    getProperty(name:string): IProperty {
        return this.props.getProperty(name);
    }

    getProperties(): IProperty[] {
        return this.props.getProperties();
    }

    build(builder: IBuilder): void {
        builder.startGroup(this.Name);
        this.props.build(builder);
        builder.endGroup(this.Name);
    }
}