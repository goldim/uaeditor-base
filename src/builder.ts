import { Direction } from "./ibindable";
import { ISerializer } from "./xml_serializer";

export interface IBuildable {
    build(builder: IBuilder): void;
}

export interface IBuilder {
    startProperties(): this;
    buildProperty(name: string, value: string): this;
    endProperties(): this;

    startObject(id: string): this;
    endObject(): this;

    startPlugin(id: string): this;
    endPlugin(): this;

    startGroup(name: string): this;
    endGroup(name: string): this;

    startUsers(): this;
    buildUser(login: string, password: string): this;
    endUsers(): this;

    startVariable(id: string): this;
    buildBinding(id: string, direction: Direction): this;
    endVariable(): this;

    startAlarm(id: string): this;
    endAlarm(): this;

    startField(id: string): this;
    endField(): this;

    startConfig(): this;
    startConfigSection(name: string): this;
    endConfigSection(): this;
    endConfig(): this;

    startScript(id: string): this;
    endScript(): this;

    getResult(): string;
}

export class Builder implements IBuilder {
    private ser: ISerializer;
    private result = '';
    private currentTag = '';

    constructor(ser: ISerializer){
        this.ser = ser;
    }

    buildUser(login: string, password: string): this {
        return this.addToResult(this.ser.serializeUser(login, password));
    }

    buildProperty(name: string, value: string): this{
        return this.addToResult(this.ser.serializeProperty(name, value));
    }

    buildBinding(id: string, direction: Direction): this {
        return this.addToResult(this.ser.serializeBinding(id, direction));
    }

    startProperties(): this {
        this.addToResult(this.ser.startProperties());
        return this;
    }

    endProperties(): this {
        return this.addToResult(this.ser.endProperties());
    }

    startObject(id: string): this {
        return this.addToResult(this.ser.startObject(id));
    }

    endObject(): this {
        return this.addToResult(this.ser.endObject());
    }

    startGroup(name: string): this {
        return this.addToResult(this.ser.startGroup(name));
    }

    endGroup(name: string): this {
        return this.addToResult(this.ser.endGroup(name));
    }

    startUsers(): this {
        return this.addToResult(this.ser.startUsers());
    }

    endUsers(): this {
        return this.addToResult(this.ser.endUsers());
    }

    startVariable(id: string): this {
        return this.addToResult(this.ser.startVariable(id));
    }

    endVariable(): this {
        return this.addToResult(this.ser.endVariable());
    }

    startConfig(): this {
        return this.addToResult(this.ser.startConfig());
    }

    startConfigSection(name: string): this {
        this.currentTag = name;
        return this.addToResult(this.ser.startConfigSection(name));
    }

    endConfigSection(): this {
        this.endClosest();
        return this;
    }

    endConfig(): this {
        return this.addToResult(this.ser.endConfig());
    }

    startScript(path: string): this {
        return this.addToResult(this.ser.startScript(path));
    }

    endScript(): this {
        return this.addToResult(this.ser.endScript());
    }

    startPlugin(id: string): this {
        return this.addToResult(this.ser.startPlugin(id));
    }

    endPlugin(): this {
        return this.addToResult(this.ser.endPlugin());
    }

    startAlarm(id: string): this {
        return this.addToResult(this.ser.startAlarm(id));
    }

    endAlarm(): this {
        return this.addToResult(this.ser.endAlarm());
    }

    startField(id: string): this {
        return this.addToResult(this.ser.startField(id));
    }

    endField(): this {
        return this.addToResult(this.ser.endField());
    }

    private endClosest(): void {
        if (this.currentTag){
            this.addToResult(this.ser.endConfigSection(this.currentTag));
        } else {
            throw new Error('there is no open section');
        }
    }

    private addToResult(str: string): this {
        this.result += str;
        return this;
    }

    getResult(): string {
        return this.result;
    }
}