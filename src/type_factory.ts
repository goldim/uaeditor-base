import { IComposite } from "./icomponent";
import { OpcObject } from "./opc_object";
import { OpcVariable } from "./opc_variable";
import { Plugin } from "./plugin";
import { Type } from "./type";

export class TypeFactory {
    static getTypeInstance(type: string): IComposite {
        const types: any = [
            ["opcobj", OpcObject],
            ["opcvar", OpcVariable],
            ["plugin", Plugin]
        ];
        const map = new Map(types);

        let res;
        if (map.has(type)){
            const className: any = map.get(type);
            res = new className();
        } else {
            res = new OpcObject();
        }
        
        return res;
    }

    static getType(name: string): Type {
        return new Type(name);
    }
}