import { ImplFactory } from './factories';
import { IProject } from './iproject';
import { Project } from './project';

export class ProjectManager {
    private static instance: ProjectManager = new ProjectManager();
    private currentProj?: IProject;

    private constructor(){
    }

    get CurrentProject(): IProject {
        if (!this.currentProj){
            this.createEmptyProject();
        }
        return this.currentProj!;
    }

    static Instance(): ProjectManager {
        return ProjectManager.instance;
    }

    createEmptyProject(): void {
        this.currentProj = new Project(ImplFactory.getProjectFactory());
        this.currentProj.open();
    }

    openProject(path: string): void {
        this.currentProj = new Project(ImplFactory.getProjectFactory());
        this.currentProj.Path = path;
        this.currentProj.open();
    }
}