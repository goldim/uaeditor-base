import { Component } from "./component";
import { IBuilder } from "./builder";
import { IComposite } from "./icomponent";
import { ILoader } from "./loader";
import { OpcVariable } from "./opc_variable";
import { ScriptLoader, VariableLoader } from "./component_loader";
import { ImplFactory } from "./factories";

export interface IScriptLoader {
    load(path: string): string;
}

export interface IScriptSaver {
    save(content: string): void;
    saveByFileName(name: string, content: string): void;
}

export class Script extends Component implements IComposite {
    private path: string;
    private content = '';
    private contentLoaded = false;

    private contentLoader: IScriptLoader;
    private contentSaver: IScriptSaver;

    constructor(path = ''){
        super(path);
        this.path = path;
        const factory = ImplFactory.getScriptFactory();
        this.contentLoader = factory.getLoader();
        this.contentSaver = factory.getSaver();
    }

    get Path(): string {
        return this.path;
    }

    get Content(): string {
        if (!this.contentLoaded){
            this.content = this.contentLoader.load(this.Path);
            this.contentLoaded = true;
        }
        return this.content;
    }

    set Content(content: string) {
        this.content = content;
        this.contentLoaded = true;
        this.modified = true;
    }

    isModified(): boolean {
        const propsModified = this.props.isModified();
        const varsModified = this.children.some(v => v.isModified());
        return propsModified || super.isModified() || varsModified;
    }

    toString(): string {
        return 'script';
    }

    getOutVars(): string[] {
        return this.children.map(v => v.Id);
    }

    getInVars(): string[] {
        return this.children.map(v => v.Id);
    }

    save(): void {
        this.contentSaver.saveByFileName(this.Path, this.Content);
        this.children.forEach(v => v.save());
        super.save();
    }

    build(builder: IBuilder): void {
        builder.startScript(this.Path);
        this.props.build(builder);
        this.children.forEach(v => v.build(builder));
        builder.endScript();
    }

    load(loader: ILoader): void {
        const script = loader.loadComponent(ScriptLoader);
        this.path = this.id = script.get('path');

        const subloader = loader.createLoader(script.get('content'));
        this.props.load(subloader);
        this.loadComponents(subloader, OpcVariable, VariableLoader);
    }
}