import { DirectoryBrowser } from '../directory_browser'
import { IPresenter } from '../presenter_registry';
import { IProject } from '../iproject';
import { ImplFactory } from '../factories';

type Entry = {
    name:string,
    type:string
}

type Entries = Entry[];

export class DirBrowserPresenter implements IPresenter {
    private browser: DirectoryBrowser;

    constructor(){
        const factory = ImplFactory.getDirManagerFactory();
        const man = factory.getDirectoryManager()
        this.browser = new DirectoryBrowser(man);
    }

    get Name(): string {
        return "dir browser";
    }

    set Project(proj: IProject){

    }

    open(dirName: string): void {
        this.browser.open(dirName);
    }

    createDir(name: string): void {
        this.browser.createDir(name);
    }

    list(onlyDirs: boolean = false): Entries {
        let entries;
        if (onlyDirs){
            entries = this.browser.listDirs();
        } else {
            entries = this.browser.list();
        }
        return entries.map(entry => {
            const type = this.browser.isProject(entry) ? 'project': 'dir';
            return {name: entry, type};
        });
    }

    getCurrentFullPath(): string {
        return this.browser.CurrentPath;
    }

    isProject(name: string): boolean {
        return this.browser.isProject(name);
    }
}