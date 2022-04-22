import { RecordSet } from "./record_set";

export interface IDeserializer {
    parseUser(user: string): Generator<RecordSet>;
    parseProperty(property: string): Generator<RecordSet>;
    parseGroup(grp: string): Generator<RecordSet>;
    parseScript(script: string): Generator<RecordSet>;
    parseVariable(variable: string): Generator<RecordSet>;
    parseObject(obj: string): Generator<RecordSet>;
    parsePlugin(plugin: string): Generator<RecordSet>;
    parseBinding(content: string): Generator<RecordSet>;
    parseAlarm(content: string): Generator<RecordSet>;
    parseField(content: string): Generator<RecordSet>;

    parseBlock(content: string, tag: string): string;
}
