import { ILoaderFactory } from "../factories";
import { ILoader } from "../loader_file";
import { MockXmlLoader } from "./loader";

export class LoaderFactory implements ILoaderFactory {
    constructor(private content: string){
    }

    getLoader(): ILoader {
        const loader = new MockXmlLoader();
        loader.Content = this.content;
        return loader;
    }
}