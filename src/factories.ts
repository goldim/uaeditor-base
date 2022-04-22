import { IDirectoryManager } from "./directory_browser";
import { ILoader } from "./loader_file";
// import { MockDirectoryManager } from "./node_impl/directory_manager";
import { DirectoryManagerFactory } from "./node_impl/directory_manager_factory";
import { ScriptFactory } from "./node_impl/script_factory";
import { ProjectFactory } from "./node_impl/project_factory";
import { ISaver } from "./saver";
import { IScriptLoader, IScriptSaver } from "./script";
import { IDeserializer, XmlDeserializer } from "./xml_deserializer";
import { ISerializer, XmlSerializer } from "./xml_serializer";

export interface IScriptFactory {
    getLoader(): IScriptLoader;
    getSaver(): IScriptSaver;
}

export interface ILoaderFactory {
    getLoader(): ILoader
}

export interface ISaverFactory {
    getSaver(): ISaver
}

export interface ISerializationFactory {
    getSerializer(): ISerializer
    getDeserializer(): IDeserializer
}

export interface IProjectFactory {
    getSaverFactory(): ISaverFactory;
    getLoaderFactory(): ILoaderFactory;
    getSerializationFactory(): ISerializationFactory;
}

export interface IDirectoryManagerFactory {
    getDirectoryManager(): IDirectoryManager;
}

export class SerializationFactory implements ISerializationFactory {
    getSerializer(): ISerializer {
        return new XmlSerializer();
    }

    getDeserializer(): IDeserializer {
        return new XmlDeserializer();
    }
}

export class ImplFactory {
    private static projectFactory: IProjectFactory;
    private static scriptFactory: IScriptFactory = new ScriptFactory();
    private static dirManagerFactory: IDirectoryManagerFactory = new DirectoryManagerFactory();

    static getProjectFactory(): IProjectFactory {
        this.projectFactory = new ProjectFactory()
        return this.projectFactory;
    }

    static getScriptFactory(): IScriptFactory {
        return ImplFactory.scriptFactory;
    }

    static getDirManagerFactory(): IDirectoryManagerFactory {
        return ImplFactory.dirManagerFactory;
    }
}