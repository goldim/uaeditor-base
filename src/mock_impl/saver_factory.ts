import { ISaverFactory } from "../factories";
import { ISaver } from "../saver";
import { MockSaver } from "./saver";

export class SaverFactory implements ISaverFactory {
    private saver: ISaver;

    constructor(){
        this.saver = new MockSaver();
    }

    getSaver(): ISaver {
        return this.saver;
    }
}
