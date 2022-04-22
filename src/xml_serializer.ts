export interface ISerializer {
    serializeUser(login: string, password: string): string;
    serializeProperty(name: string, value: string): string;
    serializeBinding(id: string, direction?: Direction): string;
    startProperties(): string;
    endProperties(): string;
    startObject(id: string): string;
    endObject(): string;
    startPlugin(id: string): string;
    endPlugin(): string;
    startGroup(name: string): string;
    endGroup(name: string): string;
    startUsers(): string;
    endUsers(): string;
    startVariable(id: string): string;
    endVariable(): string;
    startConfig(): string;
    startConfigSection(name: string): string;
    endConfigSection(name: string): string;
    endConfig(): string;
    startScript(id: string): string;
    endScript(): string;
    startAlarm(id: string): string;
    endAlarm(): string;
    startField(id: string): string;
    endField(): string;
}

import { Direction } from './ibindable';
import { XmlTags } from './xml_tags';

export class XmlSerializer implements ISerializer {
    serializeUser(login: string, password: string): string {
        return `<${XmlTags.USER} login="${login}" passwd="${password}"/>`;
    }

    serializeProperty(name: string, value: string): string {
        return `<${name}>${value}</${name}>`;
    }

    serializeBinding(id: string, direction: Direction = Direction.In): string {
        const directionStr = (direction == Direction.In) ? 'in' : 'out';
        return `<${XmlTags.BINDTO} id="${id}" direction="${directionStr}"/>`;
    }

    startProperties(): string {
        return this.startTag(XmlTags.PROPERTIES);
    }

    endProperties(): string {
        return this.endTag(XmlTags.PROPERTIES);
    }

    startObject(id: string): string {
        return this.startTag(XmlTags.OBJECT, id);
    }

    endObject(): string {
        return this.endTag(XmlTags.OBJECT);
    }

    startGroup(name: string): string {
        return this.startTag(name);
    }

    endGroup(name: string): string {
        return this.endTag(name);
    }

    startUsers(): string {
        return this.startTag(XmlTags.USERS);
    }

    endUsers(): string {
        return this.endTag(XmlTags.USERS);
    }

    startVariable(id: string): string {
        return this.startTag(XmlTags.VARIABLE, id);
    }

    endVariable(): string {
        return this.endTag(XmlTags.VARIABLE);
    }

    startConfig(): string {
        const header = '<?xml version="1.0"?>';
        return header.concat(this.startTag(XmlTags.PROJECT));
    }

    startConfigSection(name: string): string {
        return this.startTag(name);
    }

    endConfigSection(name: string): string {
        return this.endTag(name);
    }

    endConfig(): string {
        return this.endTag(XmlTags.PROJECT);
    }

    startScript(path: string): string {
        return `<${XmlTags.SCRIPT} path="${path}">`;
    }

    endScript(): string {
        return this.endTag(XmlTags.SCRIPT);
    }

    startPlugin(id: string): string {
        return this.startTag(XmlTags.PLUGIN, id);
    }

    endPlugin(): string {
        return this.endTag(XmlTags.PLUGIN);
    }

    startAlarm(id: string): string {
        return this.startTag(XmlTags.ALARM, id);
    }

    endAlarm(): string {
        return this.endTag(XmlTags.ALARM);
    }

    startField(id: string): string {
        return this.startTag(XmlTags.FIELD, id);
    }

    endField(): string {
        return this.endTag(XmlTags.FIELD);
    }

    private startTag(name: string, id?: string): string {
        if (id){
            return `<${name} id="${id}">`;
        }
        return `<${name}>`;
    }

    private endTag(name: string): string {
        return `</${name}>`;
    }
}