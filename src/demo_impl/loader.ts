import { ILoader } from "../loader_file";

export class StubXmlLoader implements ILoader {
    private content = '';
    
    constructor(){
    }

    get Content(): string {
        return this.content;
    }

    set Content(content: string) {
        this.content = content;
    }

    load(path: string): string {
        if (path){
            const users = '<users><user login="root" passwd="1234"/></users>';
            const script1 = '<script path="script1.lua"><options><freq>50</freq></options><var id="x"><options></options></var><var id="y"><options></options></var></script>'
            const script2 = '<script path="script2.lua"><options><freq>100</freq></options><var id="x"><options></options></var><var id="y"><options></options></var></script>'
            const opc = `<opc><obj id="obj1"><options><host>localhost</host><port>8080</port></options>${script1}<obj id="obj2"><options></options>${script2}</obj><var id="var2"><options></options></var></obj><var id="var1"><x>1</x><y>2</y></options></var></opc>`;
            const plugins = '<plugins><plugin id="LuaPlugin"><options></options></plugin><plugin id="HistoryPlugin"><options><maxValuesPerRequest>500</maxValuesPerRequest></options></plugin><plugin id="EventsPlugin"><options></options></plugin></plugins>';
            const groups = '<description><options><code>1111</code></options></description><settings><options><ip>localhost</ip><port>4840</port></options></settings><opcua><sessionmax>10</sessionmax></opcua><messages><onStart>hello</onStart><onEnd>bye</onEnd></messages>';
            this.content = `<?xml version="1.0"?><project><server>${groups}${users}</server>${plugins}${opc}</project>`;
        }
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