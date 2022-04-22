export interface IDirectoryManager {
    createDir(path: string): void;
    read(path: string): string[];
    CurrentDir: string;
}

type Entries = string[];

export class DirectoryBrowser {
    private manager: IDirectoryManager;
    private curPath: string[] = [];
    private readonly PATH_SEPARATOR = '/';
    private readonly PARENT_DIR = '..';

    constructor(manager: IDirectoryManager){
        this.manager = manager;
        this.curPath.push(this.PATH_SEPARATOR);
    }

    setManager(manager: IDirectoryManager): void {
        this.manager = manager;
    }

    open(dirName: string): void {
        if (dirName == this.PARENT_DIR){
            this.moveUp();
        } else {
            if (this.isProject(dirName)){
                return;
            }
            this.curPath.push(dirName);
        }
    }

    createDir(name: string): void {
        let path;
        if (this.curPath.length == 1){
            path = this.CurrentPath + name;
        } else {
            path = this.CurrentPath.concat(this.PATH_SEPARATOR, name);
        }
        this.manager.createDir(path);
    }

    list(): Entries {
        const keys = this.getEntries(this.CurrentPath);
        return this.isRoot() ? keys: this.appendParentDir(keys);
    }

    private getEntries(path: string): string[] {
        const sortWay = (a:string, b:string) => {
            a = a.toLowerCase();
            b = b.toLowerCase();
            if (a == b) return 0;
            if (a > b) return 1;
            return -1;
        }

        return this.manager.read(path).sort(sortWay);
    }

    listDirs(): Entries {
        let keys = this.getEntries(this.CurrentPath);
        keys = keys.filter((item) => !this.isProject(item));
        return this.isRoot() ? keys: this.appendParentDir(keys);
    }

    get CurrentPath(): string {
        const rootDir = this.curPath[0];
        if (this.curPath.length > 1){
            return rootDir + this.curPath.slice(1).join(this.PATH_SEPARATOR);
        }
        return rootDir;
    }

    isProject(name: string): boolean {
        const len = name.length;
        return name.substring(len, len - 5) === '.proj';
    }

    private moveUp(): void {
        const withoutRoot = this.curPath.slice(1);
        if (withoutRoot.length > 0){
            this.curPath.pop();
        }
    }

    private isRoot(): boolean {
        return this.curPath.length == 1;
    }

    private appendParentDir(dirs: Entries): Entries {
        return [this.PARENT_DIR].concat(dirs)
    }
}