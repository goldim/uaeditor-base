import { IConfig } from "../iconfig";
import { IProject } from "../iproject";
import { IPresenter } from "../presenter_registry";

export class PropertiesPresenter implements IPresenter{
    private cfg?: IConfig;

    get Name(): string {
        return 'properties';
    }

    set Project(proj: IProject){
        this.cfg = proj.Config;
    }

    getProperties(id: string): {name:string, value:string}[] {
        const comp = this.cfg!.getChild(id);
        const props = comp.getProperties();
        return props.map(prop => { return { 'name': prop.Name, 'value': prop.Value }});
    }

    changePropertyValue(id: string, name: string, value: string): void {
        const comp = this.cfg!.getChild(id);
        comp.getProperty(name).Value = value;
    }
}