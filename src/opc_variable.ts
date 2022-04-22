import { Direction, IBindable } from './ibindable';
import { IBuilder } from './builder';
import { IComponent, IComposite } from './icomponent';
import { ILoader } from './loader';
import { Component } from './component';
import { Binding } from './binding';
import { BindingLoader, VariableLoader } from './component_loader';

export class OpcVariable extends Component implements IComponent, IBindable {
    private value: any;
    protected bindings: Binding[] = [];

    constructor(id = ''){
        super(id);
    }

    add(child: IComposite): void {
        throw new Error('not possible to add');
    }

    remove(id: string): void {
        throw new Error('not possible to remove');
    }

    get Value(): any {
        return this.value;
    }

    set Value(value: any) {
        this.value = value;
    }

    toString(): string {
        return 'opcvar';
    }

    getInBindings(): string[] {
        return this.getBindings(Direction.In);
    }

    getOutBindings(): string[] {
        return this.getBindings(Direction.Out);
    }

    getBindings(direction: Direction): string[] {
        return this.bindings.filter(b => b.Direction == direction).map(b => b.Id);
    }

    load(loader: ILoader): void {
        const data = loader.loadComponent(VariableLoader);
        this.id = data.get('id');
        const subloader = loader.createLoader(data.get('content'));
        this.props.load(subloader);

        [...subloader.loadComponents(BindingLoader)].forEach(b => {
            const binding = new Binding(b.get('id'), Binding.fromString(b.get('direction')));
            this.bindings.push(binding);
        });
    }

    bindTo(anotherVar: OpcVariable, direction: Direction): void {
        if (!this.hasBinding(anotherVar.Id, direction)){
            const dirForAnother = this.anotherDirection(direction);
            this.bindings.push(new Binding(anotherVar.Id, direction));
            anotherVar.bindTo(this, dirForAnother);
            this.modified = true;
        }
    }

    unbindWith(anotherVar: OpcVariable): void {
        if (this.wasBoundTo(anotherVar)){
            const bindings = this.bindings.filter(b => b.Id == anotherVar.Id);
            bindings.forEach(b => {
                this.removeBinding(b);
            });
            anotherVar.unbindWith(this);
            this.modified = true;
        }
    }

    wasBoundTo(anotherVar: OpcVariable): boolean {
        const checkFunc = (b: Binding) => b.Id == anotherVar.Id;
        return this.bindings.some(checkFunc);
    }

    wasBound(): boolean {
        return this.bindings.length > 0;
    }

    build(builder: IBuilder): void {
        builder.startVariable(this.Id);
        this.props.build(builder);
        this.bindings.forEach(b => b.build(builder));
        builder.endVariable();
    }

    protected removeBinding(binding: Binding): void {
        const found = this.bindings.findIndex(b => b == binding);
        if (found !== -1){
            this.bindings.splice(found, 1);
        }
    }

    private anotherDirection(direction: Direction): Direction {
        return direction == Direction.In ? Direction.Out : Direction.In;
    }

    private hasBinding(id: string, direction: Direction): boolean {
        const checkFunc = (b: Binding) => b.Id == id && b.Direction == direction;
        return this.bindings.some(checkFunc);
    }
}