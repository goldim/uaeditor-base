import { IScriptFactory } from "../factories";
import { IScriptLoader, IScriptSaver } from "../script";
import { ScriptLoader } from "./script_loader";
import { ScriptSaver } from "./script_saver";

export class ScriptFactory implements IScriptFactory {
    private loader: IScriptLoader;
    private saver: IScriptSaver;

    constructor() {
        this.saver = new ScriptSaver();
        this.loader = new ScriptLoader();
    }

    getLoader(): IScriptLoader {
        return this.loader;
    }

    getSaver(): IScriptSaver {
        return this.saver;
    }
}