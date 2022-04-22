import { readdirSync, mkdirSync } from "fs";
import { extname } from "path";
import { IDirectoryManager } from "../directory_browser";

export class DirectoryManager implements IDirectoryManager {
    createDir(path: string): void {
        mkdirSync(path);
    }

    //@TODO refactoring needed
    read(path: string): string[] {
        const items = readdirSync(path, { withFileTypes: true }).map(item => {
            if (item.isFile()){
                return extname(item.name) === ".proj" ? item.name: "";
            } else if (item.isDirectory()) {
                return (item.name.length && item.name[0] !== '.') ? item.name: "";
            } else {
                return "";
            }
        }).filter(item => item !== "");
        return items;
    }

    set CurrentDir(path: string) {
        process.chdir(path.replace("main.proj", ""))
    }
}