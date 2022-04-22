import { Binding } from "./binding";
import { IBuilder } from "./builder";
import { BindingLoader, FieldLoader } from "./component_loader";
import { Direction } from "./ibindable";
import { IComponent } from "./icomponent";
import { ILoader } from "./loader";
import { OpcVariable } from "./opc_variable";
import { RecordSet } from "./record_set";

export class Field extends OpcVariable implements IComponent {
    toString(): string {
        return 'field';
    }

    addProperty(name: string, value: string): void {
        throw new Error("fields don't have properties");
    }

    bindTo(anotherVar: OpcVariable, direction: Direction): void {
        if (anotherVar instanceof Field){
            throw new Error('forbidden binding field to field');
        }

        if (direction === Direction.Out){
            throw new Error('only allowed binding direction from variable to field');
        }

        if (!this.wasBoundTo(anotherVar)){
            const dirForAnother = Direction.Out;
            this.bindings.push(new Binding(anotherVar.Id, direction));
            anotherVar.bindTo(this, dirForAnother);
            this.modified = true;
        }
    }

    build(builder: IBuilder): void {
        builder.startField(this.Id);
        this.bindings.forEach(b => b.build(builder));
        builder.endField();
    }

    load(loader: ILoader): void {
        const data = loader.loadComponent(FieldLoader);
        this.id = data.get('id');

        const subloader = loader.createLoader(data.get('content'));
        [...subloader.loadComponents(BindingLoader)].forEach(this.loadBinding.bind(this));
    }

    private loadBinding(b: RecordSet): void {
        const direction = Binding.fromString(b.get('direction'));
        if (direction === Direction.In){
            this.bindings.push(new Binding(b.get('id'), direction));
        } else {
            throw new Error('loading: only allowed binding direction from variable to field');
        }
    }
}