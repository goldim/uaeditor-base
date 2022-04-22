import { IComponentLoader } from "./component_loader";
import { RecordSet } from "./record_set";
import { IDeserializer } from "./xml_deserializer";

export interface ILoadable {
    load(loader: ILoader): void;
}

export interface ILoader {
    loadBlock(tag: string): ILoader;
    createLoader(content: string): ILoader
    
    loadComponent(name: any): RecordSet;
    loadComponents(name: any): Generator<RecordSet>;
}

export class Loader {
    private loaders: IComponentLoader[] = [];

    constructor(private content: string, private deserializer: IDeserializer){
    }

    private getSpecificLoader(loaderName: any): IComponentLoader {
        let found = this.loaders.find(loader => loader instanceof loaderName);
        
        if (found === undefined){
            found = this.createComponentLoader(loaderName);
            this.loaders.push(found);
        }
        return found;
    }

    createComponentLoader(name: any): IComponentLoader {
        return new name(this.content, this.deserializer);
    }

    loadComponent(loaderName: any): RecordSet {
        return this.getSpecificLoader(loaderName).loadComponent();
    }

    *loadComponents(loaderName: any): Generator<RecordSet> {
        yield *this.getSpecificLoader(loaderName).getGenerator();
    }

    loadBlock(tag: string): ILoader {
        const block = this.deserializer.parseBlock(this.content, tag);
        return this.createLoader(block);
    }

    createLoader(content: string): ILoader {
        return new Loader(content, this.deserializer);
    }
}