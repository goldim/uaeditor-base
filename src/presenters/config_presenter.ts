import { ComponentTreeBuilder } from "../component_tree_builder";
import { Config } from "../config";
import { Direction } from "../ibindable";
import { IComposite } from "../icomponent";
import { IConfig } from "../iconfig";
import { IProject } from "../iproject";
import { OpcVariable } from "../opc_variable";
import { IPresenter } from "../presenter_registry";
import { TypeFactory } from "../type_factory";
import { TypeRepository } from "../type_repository";

export class ConfigPresenter implements IPresenter {
    private cfg: IConfig;
    private builder: ComponentTreeBuilder;

    constructor(){
        this.builder = new ComponentTreeBuilder();
        this.cfg = new Config();
    }

    set Project(proj: IProject){
        this.cfg = proj.Config;
    }

    get Name(): string {
        return 'config';
    }

    getComponentTree(): any {
        return this.builder.makeTree(this.cfg);
    }

    bind(id1: string, id2: string): boolean {
        const child1 = this.cfg.getChild(id1);
        const child2 = this.cfg.getChild(id2);
        if (child1 instanceof OpcVariable && child2 instanceof OpcVariable){
            const var1 = child1 as OpcVariable;
            const var2 = child2 as OpcVariable;
            var1.bindTo(var2, Direction.In);
            return true;
        }
        return false;
    }

    getInBindingsFor(id: string): string[]{
        const child = this.cfg.getChild(id);
        if (child instanceof OpcVariable){
            const v = child as OpcVariable;
            return v.getInBindings();
        }
        return [];
    }

    getOutBindingsFor(id: string): string[]{
        const child = this.cfg.getChild(id);
        if (child instanceof OpcVariable){
            const v = child as OpcVariable;
            return v.getOutBindings();
        }
        return [];
    }

    add(parentId: string, newId: string, type: string): void {
        const parent = this.getParentById(parentId);
        const component = TypeFactory.getTypeInstance(type);
        console.log(component);
        component.Id = newId;
        parent.add(component);
    }

    remove(id: string): void {
        if (id === 'root'){
            return;
        }
        const separator = '/';
        const parts = id.split(separator);
        if (parts.length === 1){
            this.cfg.remove(id);
        } else {
            const childId = parts.pop();
            if (childId !== undefined){
                const parentId = parts.join(separator);
                this.cfg.getChild(parentId).remove(childId);
            }
        }
    }

    changeId(oldId: string, newId: string): void {
        const child = this.cfg.getChild(oldId);
        child.Id = newId;
    }

    getChildrenTypes(typeName: string): string[] | null {
        const repository = new TypeRepository();
        repository.load();
        const type = repository.getType(typeName);
        if (type){
            return type?.getChildTypeNames();
        }
        return [];
    }

    private getParentById(parentId: string): IComposite {
        let result;
        if (parentId === 'root'){
            result = this.cfg as IComposite;
        } else {
            result = this.cfg.getChild(parentId);
        }
        return result;
    }
}