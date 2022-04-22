import { readFileSync } from "fs";
import { IScriptLoader } from "../script";

export class ScriptLoader implements IScriptLoader {

    load(path: string): string {
        console.info("Loading script by path: ", path);
        return readFileSync(path, { encoding: 'utf-8' });
    }
}