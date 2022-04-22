import * as Path from "path";
import { IDirectoryManager } from "../directory_browser";

export class DirectoryManager implements IDirectoryManager {
    private struct: any;

    setStruct(struct: any): void {
        this.struct = struct;
    }

    createDir(path: string): void {
        if (path == '/') return;

        const newDir = Path.basename(path);
        const dirWithoutNewDir = Path.dirname(path);
        const pointer = this.getDirPointer(dirWithoutNewDir);
        pointer.children[newDir] = {
            "children": {}
        };
    }

    set CurrentDir(path: string) {
    }

    read(path: string): string[] {
        return Object.keys(this.getDirPointer(path).children);
    }

    private getDirPointer(path: string): any {
        let dirs: string[];
        if (path != '/'){
            dirs = path.split('/');
            dirs.shift();
        } else {
            dirs = [];
        }

        let pointer: any = this.struct;
        for (const dir of dirs){
            pointer = pointer.children[dir];
        }
        return pointer;
    }
}