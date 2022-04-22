import { ISaver } from "../saver";

export class StubSaver implements ISaver {
    private content = '';

    get Content(): string {
        return this.content;
    }

    save(content: string): void {
        this.content = content;
        console.info('saving');
        console.info(content);
    }
}