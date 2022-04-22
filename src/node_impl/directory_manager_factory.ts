import { IDirectoryManager } from "../directory_browser";
import { IDirectoryManagerFactory } from "../factories";
import { DirectoryManager } from "./directory_manager";

export class DirectoryManagerFactory implements IDirectoryManagerFactory {
    getDirectoryManager(): IDirectoryManager {
        return new DirectoryManager();
    }
}