import { Type, Types } from "./type";

export class TypeRepository {
    private types: Types = [];

    load(): void {
        let varT = new Type('opcvar');
        this.add(varT);

        let objT = new Type('opcobj');
        objT.addChildType(varT);
        objT.addChildType(objT);
        this.add(objT);
        
        let pluginT = new Type('plugin');
        this.add(pluginT);
    }

    add(t: Type): void {
        this.types.push(t);
    }

    getType(name: string): Type | null {
        const foundType = this.types.find(t => t.Name === name);
        return foundType === undefined ? null : foundType;
    }

    hasType(name: string): boolean {
        return this.types.some(t => t.Name === name);
    }
}