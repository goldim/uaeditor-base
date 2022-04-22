import { ScriptPresenter } from "./presenters/script_presenter";
import { IProject } from "./iproject";
import { ConfigPresenter } from "./presenters/config_presenter";
import { DirBrowserPresenter } from "./presenters/dir_browser_presenter";
import { ProjectPresenter } from "./presenters/project_presenter";
import { PropertiesPresenter } from "./presenters/properties_presenter";
import { UsersPresenter } from "./presenters/users_presenter";
import { ProjectManager } from "./project_manager";
import { PropertyGroupPresenter } from "./presenters/property_group_presenter";
import { SettingsPresenter } from "./presenters/settings_presenter";

export interface IPresenter {
    set Project(project: IProject);
    Name: string;
}

export class PresenterRegistry {
    private manager: ProjectManager;
    private static instance = new PresenterRegistry();
    private presenters: IPresenter[] = [];

    private constructor(){
        this.manager = ProjectManager.Instance();
        this.createPresenters();
    }

    static Instance(): PresenterRegistry {
        return this.instance;
    }

    static getPresenter(name: string): IPresenter | undefined {
        return this.Instance().findPresenter(name);
    }

    private findPresenter(name: string): IPresenter | undefined {
        return this.presenters.find(presenter => presenter.Name === name);
    }

    private createPresenters(): void {
        [
            ProjectPresenter,
            UsersPresenter,
            ConfigPresenter,
            DirBrowserPresenter,
            PropertiesPresenter,
            ScriptPresenter,
            PropertyGroupPresenter,
            SettingsPresenter
        ]
        .forEach(name => this.createPresenter(name as any));
    }

    private createPresenter<C extends IPresenter>(className: new() =>C): void {
        const c = new className();
        c.Project = this.manager.CurrentProject;
        this.presenters.push(c);
    }

    getPresenters(): IPresenter[] {
        return this.presenters;
    }
}