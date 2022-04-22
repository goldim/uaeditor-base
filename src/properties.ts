import { IProperty, Property } from './property';
import { IProperties } from './iproperties';
import { ISaveable } from './isaveable';
import { IModifiable } from './imodifiable';
import { IBuildable, IBuilder } from './builder';
import { ILoadable, ILoader } from './loader';
import { PropertyLoader } from './component_loader';

export class Properties implements IProperties, ISaveable, IModifiable, IBuildable, ILoadable {
    private props: Property[] = [];

    addProperty(name: string, value: string, required = false): void {
        const p = new Property(name, value, required);
        this.props.push(p);
    }

    hasProperty(name: string): boolean {
        return this.props.some((prop) => prop.Name == name);
    }

    getProperty(name: string): IProperty {
        const found = this.props.find((prop) => prop.Name == name);
        return found ? found : Property.getNotFoundProperty();
    }

    getProperties(): Property[] {
        return this.props;
    }

    save(): void {
        this.props.forEach(prop => prop.save());
    }

    isModified(): boolean {
        return this.props.some(prop => prop.isModified());
    }

    load(loader: ILoader): void {
        [...loader.loadComponents(PropertyLoader)].forEach(prop => this.addProperty(prop.get('name'), prop.get('value')));
    }

    build(builder: IBuilder): void {
        builder.startProperties();
        this.props.forEach(prop => prop.build(builder));
        builder.endProperties();
    }

    wasSaved(): boolean {
        return this.props.every(prop => prop.wasSaved());
    }
}