import { ILoader } from "../loader_file";

export class MockXmlLoader implements ILoader {
    private content = '';

    get Content(): string {
        return this.content;
    }

    set Content(content: string) {
        this.content = content;
    }

    load(path: string): string {
        return this.content;
    }

    loadEmpty(): string {
        const users = '<users></users>';
        const opc = `<opc></opc>`;
        const plugins = '<plugins><plugin id="LuaPlugin"><options></options></plugin><plugin id="HistoryPlugin"><options><maxValuesPerRequest>500</maxValuesPerRequest></options></plugin><plugin id="EventsPlugin"><options></options></plugin></plugins>';
        const groups = '<description><options><code></code></options></description><settings><options><ip></ip><port></port></options></settings><opcua><sessionmax></sessionmax></opcua><messages><onStart></onStart><onEnd></onEnd></messages>';
        return `<?xml version="1.0"?><project><server>${groups}${users}</server>${plugins}${opc}</project>`;
    }
}