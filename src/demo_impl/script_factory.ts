import { IScriptFactory } from "../factories";
import { IScriptLoader, IScriptSaver } from "../script";
import { StubScriptLoader } from "./script_loader";
import { StubScriptSaver } from "./script_saver";

export class ScriptFactory implements IScriptFactory {
    private loader: IScriptLoader;
    private saver: IScriptSaver;

    constructor() {
        this.saver = new StubScriptSaver();
        this.loader = new StubScriptLoader();
    }

    getLoader(): IScriptLoader {
        return this.loader;
    }
    getSaver(): IScriptSaver {
        return this.saver;
    }
}