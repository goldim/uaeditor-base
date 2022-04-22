import { IComposite, Composites } from "./icomponent";
import { ILoadable, ILoader } from "./loader";
import { NullComponent } from "./null_component";
import { Properties } from "./properties";
import { IProperty } from "./property";

export abstract class Component {
    protected id: string;
    protected props: Properties = new Properties();
    protected modified = false;
    protected saved = false;
    protected children: Composites = [];

    constructor(id: string){
        this.id = id;
    }

    get Id(): string {
        return this.id;
    }

    set Id(id: string){
        this.id = id;
        this.modified = true;
    }

    add(component: IComposite): void {
        this.children.push(component);
        this.modified = true;
    }

    remove(id: string): void {
        const i = this.children.findIndex(component => component.Id === id);
        if (i !== -1){
            this.children.splice(i, 1);
            this.modified = true;
        }
    }

    protected searchChildTopLevel(id: string): IComposite {
        const found = this.children.find(c => c.Id === id);
        return found ? found: this.getNotFoundComponent();
    }

    protected getChildInSubChildren(id: string): IComposite {
        const res = this.children.find(child => child.hasChild(id));
        return res ? res.getChild(id) : this.getNotFoundComponent();
    }

    hasChild(id: string): boolean {
        const found = this.children.some(child => child.Id === id);
        return found ? true: this.children.some(child => child.hasChild(id)); 
    }

    getChild(id: string): IComposite {
        return this.searchChildTopLevel(id);
    }

    getChildren(): Composites {
        return this.children;
    }

    wasSaved(): boolean {
        return this.saved && this.props.wasSaved();
    }

    save(): void {
        this.props.save();
        this.saved = true;
        this.modified = false;
    }

    isModified(): boolean {
        return this.modified || this.props.getProperties().some(prop => prop.isModified());
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

    getNotFoundComponent(): IComposite {
        return new NullComponent();
    }

    loadComponents<T extends ILoadable>(loader: ILoader, type: new() => T, componentLoader: any): void {
        [...loader.loadComponents(componentLoader)].forEach(data => {
            this.loadComponent(loader, type, this.children);
        });
    }

    loadComponentsWithSection<T extends ILoadable>(loader: ILoader, blockName: string, type: new() => T, componentLoader: any): void {
        const subloader = loader.loadBlock(blockName);
        this.loadComponents(subloader, type, componentLoader);
    }

    loadComponent<T extends ILoadable>(loader: ILoader, type: new() => T, where: any[]): void {
        const obj = new type();
        obj.load(loader);
        where.push(obj);
    }
}