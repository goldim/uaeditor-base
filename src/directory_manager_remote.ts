import { IDirectoryManager } from "./directory_browser";

export class RemoteDirectoryManager implements IDirectoryManager {
    createDir(path: string): void {

    }

    public read(path: string): string[] {
        return [];
    }

    set CurrentDir(dir: string) {}
}