import { IProject } from '../iproject';
import { IPresenter, PresenterRegistry } from '../presenter_registry';
import { ProjectManager } from '../project_manager';

interface ISubscriber {
    notifyOpened(): void;
};

export class ProjectPresenter implements IPresenter {
    private subscribers: ISubscriber[] = [];

    addSubscriber(sub: ISubscriber): void {
        this.subscribers.push(sub);
    }

    get Name(): string {
        return 'project';
    }

    set Project(proj: IProject){

    }

    getPath(): string {
        return ProjectManager.Instance().CurrentProject.Path;
    }

    setPath(path: string): void {
        ProjectManager.Instance().CurrentProject.Path = path;
    }

    hasPath(): boolean {
        return !!ProjectManager.Instance().CurrentProject.Path;
    }

    createNew(): void {
        ProjectManager.Instance().createEmptyProject();
        PresenterRegistry.Instance().getPresenters().forEach(p => p.Project = ProjectManager.Instance().CurrentProject);
        this.subscribers.forEach(sub => sub.notifyOpened());
    }

    open(path: string): void {
        ProjectManager.Instance().openProject(path);
        PresenterRegistry.Instance().getPresenters().forEach(p => p.Project = ProjectManager.Instance().CurrentProject);
        this.subscribers.forEach(sub => sub.notifyOpened());
    }

    close(): void {
        ProjectManager.Instance().CurrentProject.close();
    }

    save(): void {
        ProjectManager.Instance().CurrentProject.save();
    }
}