import { IComposite } from './icomponent';

import { IBuilder } from './builder';
import { OpcVariable } from './opc_variable';
import { ILoader } from './loader';
import { Component } from './component';
import { Script } from './script';
import { NullComponent } from './null_component';
import { ObjectLoader, ScriptLoader, VariableLoader } from './component_loader';

export class OpcObject extends Component implements IComposite {
    constructor(id = ''){
        super(id);
    }

    toString(): string {
        return 'opcobj';
    }

    getChild(id: string): IComposite {
        const res = super.getChild(id);
        if (this.isFoundChild(res)) {
            return res;
        }
        else {
            return this.getChildInSubChildren(id);
        }
    }

    private isFoundChild(component: IComposite): boolean {
        return !(component instanceof NullComponent);
    }

    save(): void {
        this.children.forEach((obj) => obj.save());
        super.save();
    }

    wasSaved(): boolean {
        return super.wasSaved() && this.children.every(child => child.wasSaved());
    }

    isModified(): boolean {
        return super.isModified() || this.children.some(child => child.isModified());
    }

    build(builder: IBuilder): void {
        builder.startObject(this.Id);
        this.props.build(builder);
        this.children.forEach(child => child.build(builder));
        builder.endObject();
    }

    load(loader: ILoader): void {
        const data = loader.loadComponent(ObjectLoader);
        this.id = data.get('id');

        const subloader = loader.createLoader(data.get('content'));
        this.props.load(subloader);
        
        this.loadComponents(subloader, Script, ScriptLoader);
        this.loadComponents(subloader, OpcObject, ObjectLoader);
        this.loadComponents(subloader, OpcVariable, VariableLoader);
    }
}