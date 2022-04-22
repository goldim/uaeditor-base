import { ILoaderFactory, ISaverFactory, ISerializationFactory, SerializationFactory } from "../factories";
import { LoaderFactory } from "./loader_factory";
import { SaverFactory } from "./saver_factory";

export class ProjectFactory {
    saverFactory: ISaverFactory;
    loaderFactory: ILoaderFactory;
    serializationFactory: ISerializationFactory;

    constructor(){
        this.saverFactory = new SaverFactory();
        this.loaderFactory = new LoaderFactory();
        this.serializationFactory = new SerializationFactory();
    }

    getSaverFactory(): ISaverFactory {
        return this.saverFactory;
    }

    getLoaderFactory(): ILoaderFactory {
        return this.loaderFactory;
    }

    getSerializationFactory(): ISerializationFactory {
        return this.serializationFactory;
    }
}