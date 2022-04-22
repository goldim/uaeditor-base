import { IDirectoryManager } from "../directory_browser";
import { IDirectoryManagerFactory } from "../factories";
import { DirectoryManager } from "./directory_manager";

export class DirectoryManagerFactory implements IDirectoryManagerFactory {
    getDirectoryManager(): IDirectoryManager {
        const man = new DirectoryManager();
        man.setStruct(
            {
                "children": {
                    "home": {
                        "children": {
                            "images": {
                                "children": {
                                }
                            }
                        }
                    },
                    "main.proj": {}
                }
            }
        );
        return man;
    }
}