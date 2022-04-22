import { writeFileSync } from "fs";
import { IScriptSaver } from "../script";

export class ScriptSaver implements IScriptSaver {
    save(content: string): void {
        console.info('saving');
        console.info(content.slice(0, 50));
    }

    saveByFileName(name: string, content: string): void {
        writeFileSync(name, content);
    }
}