import { RecordSet } from "./record_set";
import { IDeserializer } from "./xml_deserializer";

export interface IComponentLoader {
    loadComponent(): RecordSet;
    loadComponents(): Generator<RecordSet>;
    getGenerator(): Generator<RecordSet>;
}

abstract class ComponentLoader implements IComponentLoader {
    protected components: Generator<RecordSet>;

    constructor(protected content: string, protected deserializer: IDeserializer){
        this.components = this.getGenerator();
    }

    loadComponent(): RecordSet {
        return this.components.next().value;
    }

    *loadComponents(): Generator<RecordSet> {
        yield *this.components;
    }

    abstract getGenerator(): Generator<RecordSet>;
}

export class AlarmLoader extends ComponentLoader {
    *getGenerator(): Generator<RecordSet> {
        yield *this.deserializer.parseAlarm(this.content);
    }
}

export class FieldLoader extends ComponentLoader {
    *getGenerator(): Generator<RecordSet> {
        yield *this.deserializer.parseField(this.content);
    }
}

export class PluginLoader extends ComponentLoader {
    *getGenerator(): Generator<RecordSet> {
        yield *this.deserializer.parsePlugin(this.content);
    }
}

export class ObjectLoader extends ComponentLoader {
    *getGenerator(): Generator<RecordSet> {
        yield *this.deserializer.parseObject(this.content);
    }
}

export class VariableLoader extends ComponentLoader {
    *getGenerator(): Generator<RecordSet> {
        yield *this.deserializer.parseVariable(this.content);
    }
}

export class UserLoader extends ComponentLoader {
    *getGenerator(): Generator<RecordSet> {
        yield *this.deserializer.parseUser(this.content);
    }
}

export class ScriptLoader extends ComponentLoader {
    *getGenerator(): Generator<RecordSet> {
        yield *this.deserializer.parseScript(this.content);
    }
}

export class GroupLoader extends ComponentLoader {
    *getGenerator(): Generator<RecordSet> {
        yield *this.deserializer.parseGroup(this.content);
    }
}

export class PropertyLoader extends ComponentLoader {
    *getGenerator(): Generator<RecordSet> {
        yield *this.deserializer.parseProperty(this.content);
    }
}

export class BindingLoader extends ComponentLoader {
    *getGenerator(): Generator<RecordSet> {
        yield *this.deserializer.parseBinding(this.content);
    }
}