import { ISaverFactory } from "../factories";
import { ISaver } from "../saver";
import { StubSaver } from "./saver";

export class SaverFactory implements ISaverFactory {
    private saver: ISaver;

    constructor(){
        this.saver = new StubSaver();
    }

    getSaver(): ISaver {
        return this.saver;
    }
}
