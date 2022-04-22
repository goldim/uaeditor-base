import { IComposite } from './icomponent';
import { IBuilder } from './builder';
import { OpcObject } from './opc_object';

export class Device extends OpcObject implements IComposite {
    constructor(id = ''){
        super(id);
    }

    toString(): string {
        return 'device';
    }

    build(builder: IBuilder): void {
        builder.startObject(this.Id);
        this.props.build(builder);
        this.children.forEach(child => child.build(builder));
        builder.endObject();
    }
}