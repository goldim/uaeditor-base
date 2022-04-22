import { IScriptLoader } from "../script";

export class StubScriptLoader implements IScriptLoader {
    load(path: string): string {
        return "let i = 0;\ni+=1;";
    }
}