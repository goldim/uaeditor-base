import { ISaverFactory } from "../factories";
import { ISaver } from "../saver";
import { Saver } from "./saver";

export class SaverFactory implements ISaverFactory {
    private saver: ISaver;

    constructor(){
        this.saver = new Saver();
    }

    getSaver(): ISaver {
        return this.saver;
    }
}
