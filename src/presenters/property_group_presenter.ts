import { IConfig } from "../iconfig";
import { IProject } from "../iproject";
import { IPresenter } from "../presenter_registry";

export class PropertyGroupPresenter implements IPresenter {
    private cfg?: IConfig;

    constructor(){
    }

    get Name(): string {
        return 'propertygroup';
    }

    set Project(proj: IProject){
        this.cfg = proj.Config;
    }

    changeOptionValue(grpName: string, propName:string, value:string): void {
        const property = this.cfg!.getPropertyGroup(grpName).getProperty(propName);
        property.Value = value;
    }

    getOptions(name: string): {name:string, value:string}[] {
        const grp = this.cfg!.getPropertyGroup(name);
        return grp.getProperties().map(prop => {return { 'name': prop.Name, 'value': prop.Value } });
    }
}