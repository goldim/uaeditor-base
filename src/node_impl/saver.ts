import { writeFileSync } from "fs";
import { ISaver } from "../saver";

export class Saver implements ISaver {
    private content = '';
    static MAIN_FILENAME = "main.proj";

    get Content(): string {
        return this.content;
    }


    save(content: string): void {
        this.content = content;
        writeFileSync(Saver.MAIN_FILENAME, content);
    }
}