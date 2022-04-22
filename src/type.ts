export interface IOption {
    name: string,
    type: string | string[],
    defaultValue: string
}

export type Types = Type[];
export type NameType = string;
export type NamesType = NameType[];

export class Type {
    private name: NameType;
    private children: Types = [];
    private options: string[] = [];

    constructor(name: NameType){
        this.name = name;
    }

    get Name(): NameType {
        return this.name;
    }

    addChildType(t: Type): void {
        this.children.push(t);
    }

    addOption(name: string): void {
        this.options.push(name);
    }

    getChildTypes(): Types {
        return this.children;
    }

    getOptions(): string[] {
        return this.options;
    }

    getChildTypeNames(): NamesType {
        return this.children.map(child => child.Name);
    }
}