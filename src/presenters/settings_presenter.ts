import { IProject } from "../iproject";
import { IPresenter } from "../presenter_registry";
import { Config, LocalStorageSaver, Loader, NotifyFunc } from "uaeditor-user-settings";

interface Option {
    key: string; 
    value: string;
    type: string | string[];
}

type Options = Option[];

interface Group {
    name: string;
    options: Options;
}

export class SettingsPresenter implements IPresenter {
    private cfg: Config;

    constructor(){
        this.cfg = new Config();

        const content = {
            "common": {
                "user": [
                    {
                        "key": "login",
                        "value": "root",
                        "type": "string",
                        "update_to_apply": false
                    },

                    {
                        "key": "password",
                        "value": "1111",
                        "type": "password",
                        "update_to_apply": true
                    }
                ],
                "gui": [
                    {
                        "key": "theme",
                        "value": "simple",
                        "type": ['classic','simple','indigo','modern']
                    },

                    {
                        "key": "editor theme",
                        "value": "white",
                        "type": ['dark','white']
                    }
                ]
            }
        };

        this.cfg.load(new Loader(content));
    }

    get Name(): string {
        return 'settings';
    }

    set Project(proj: IProject){
    }

    needUpdateToApply(): boolean {
        return this.cfg.UpdateToApply;
    }

    getSectionNames(): string[] {
        return this.cfg.getSectionNames();
    }

    save(): void {
        const saver = new LocalStorageSaver();
        this.cfg.save(saver);
    }

    subscribe(subscriber: any, key: string): void {
        const option = this.cfg.getOption(key);
        option.subscribe(subscriber);
    }

    addNotifierOnKey(cb: NotifyFunc, key: string): void {
        const option = this.cfg.getOption(key);
        option.registerNotifier(cb);
    }

    getValue(key: string): string {
        return this.cfg.getValue(key);
    }

    setValueForOption(key: string, newValue: string){
        this.cfg.setValue(key, newValue);
    }

    getGroupsBySection(name: string): Group[] | null {
        return this.cfg.getGroupsBySectionName(name)
            .map(group => {
                    const options = group.getOptions().map(option => {
                        return { 
                            key: option.Key,
                            value: option.Value,
                            type: option.Type,
                        };
                    });

                    return {
                            name: group.Name,
                            options: options
                    }
                }
            );
    }
}