import { ILoaderFactory } from "../factories";
import { ILoader } from "../loader_file";
import { StubXmlLoader } from "./loader";

export class LoaderFactory implements ILoaderFactory {
    private content: string;

    constructor(){
        this.content = this.getEmptyProjectConfig();
    }

    getLoader(): ILoader {
        const loader = new StubXmlLoader();
        loader.Content = this.content;
        return loader;
    }

    private getEmptyProjectConfig(): string {
        const users = '<users></users>';
        const opc = `<opc></opc>`;
        const plugins = '<plugins><plugin id="LuaPlugin"><options></options></plugin><plugin id="HistoryPlugin"><options><maxValuesPerRequest>500</maxValuesPerRequest></options></plugin><plugin id="EventsPlugin"><options></options></plugin></plugins>';
        const groups = '<description><options><code></code></options></description><settings><options><ip></ip><port></port></options></settings><opcua><sessionmax></sessionmax></opcua><messages><onStart></onStart><onEnd></onEnd></messages>';
        return `<?xml version="1.0"?><project><server>${groups}${users}</server>${plugins}${opc}</project>`;
    }
}