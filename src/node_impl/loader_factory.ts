import { ILoaderFactory } from "../factories";
import { ILoader } from "../loader_file";
import { XmlLoader } from "./loader";

export class LoaderFactory implements ILoaderFactory {
    getLoader(): ILoader {
        return new XmlLoader();
    }
}