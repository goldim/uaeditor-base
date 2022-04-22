import { IScriptSaver } from "../script";

export class StubScriptSaver implements IScriptSaver {
    save(content: string): void {
        console.info('saving');
        console.info(content.slice(0, 50));
    }

    saveByFileName(name: string, content: string): void {
    }
}