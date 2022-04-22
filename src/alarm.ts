import { Field } from "./alarm_field";
import { IBuilder } from "./builder";
import { AlarmLoader, FieldLoader } from "./component_loader";
import { IComposite } from "./icomponent";
import { ILoader } from "./loader";
import { OpcObject } from "./opc_object";

export class Alarm extends OpcObject implements IComposite {
    toString(): string {
        return 'alarm';
    }

    build(builder: IBuilder): void {
        builder.startAlarm(this.Id);
        this.props.build(builder);
        this.children.forEach(field => field.build(builder));
        builder.endAlarm();
    }

    load(loader: ILoader): void {
        const data = loader.loadComponent(AlarmLoader);
        this.id = data.get('id');

        const subloader = loader.createLoader(data.get('content'));
        this.props.load(subloader);

        this.loadComponents(subloader, Field, FieldLoader);
    }
}