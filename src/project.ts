import { IProject } from './iproject';
import { Config } from './config';
import { Builder } from './builder';
import { ISerializer } from './xml_serializer';
import { ISaver } from './saver';
import { IDeserializer } from './xml_deserializer';
import { ILoader } from './loader_file';
import { Loader } from './loader';
import { ImplFactory, IProjectFactory } from './factories';
import { IConfig } from './iconfig';

export class Project implements IProject {
    private opened = false;
    private path = '';
    private cfg: Config;
    private serializer: ISerializer;
    private deserializer: IDeserializer;
    private saver: ISaver;
    private loader: ILoader;

    constructor(factory: IProjectFactory){
        this.cfg = new Config();
        this.serializer = factory.getSerializationFactory().getSerializer();
        this.deserializer = factory.getSerializationFactory().getDeserializer();
        this.saver = factory.getSaverFactory().getSaver();
        this.loader = factory.getLoaderFactory().getLoader();
    }

    set Path(path: string) {
        this.path = path;
        ImplFactory.getDirManagerFactory().getDirectoryManager().CurrentDir = path;
    }

    get Path(): string {
        return this.path;
    }

    get Config(): IConfig {
        return this.cfg;
    }

    public open(): void {
        if (!this.isOpened()){
            if (!this.cfg){
                this.cfg = new Config();
            }
            if (this.Path){
                const cfgContent = this.loader.load(this.Path);
                this.cfg.load(new Loader(cfgContent, this.deserializer));
            } else {
                const cfgContent = this.loader.loadEmpty();
                this.cfg.load(new Loader(cfgContent, this.deserializer));
            }
            this.opened = true;
        }
    }

    public close(): void {
        this.opened = false;
    }

    public save(): void {
        if (this.cfg.isModified()){
            const builder = new Builder(this.serializer);
            this.cfg.build(builder);
            this.saver.save(builder.getResult());
            this.cfg.save();
        }
    }

    public wasSaved(): boolean {
        return this.cfg.wasSaved();
    }

    public isModified(): boolean {
        return this.cfg.isModified();
    }

    public isOpened(): boolean {
        return this.opened;
    }
}