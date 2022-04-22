import { readFileSync } from "fs";
import { ILoader } from "../loader_file";

export class XmlLoader implements ILoader {
    load(path: string): string {
        console.info("reading XML by path:", path);
        return readFileSync(path, { encoding: 'utf-8' });
    }

    loadEmpty(): string {
        const users = '<users></users>';
        const opc = `<opc></opc>`;
        const plugins = '<plugins><plugin id="LuaPlugin"><options></options></plugin><plugin id="HistoryPlugin"><options><maxValuesPerRequest>500</maxValuesPerRequest></options></plugin><plugin id="EventsPlugin"><options></options></plugin></plugins>';
        const groups = '<description><options><code></code></options></description><settings><options><ip></ip><port></port></options></settings><opcua><sessionmax></sessionmax></opcua><messages><onStart></onStart><onEnd></onEnd></messages>';
        return `<?xml version="1.0"?><project><server>${groups}${users}</server>${plugins}${opc}</project>`;
    }
}