import { IProject } from "../iproject";

export abstract class Presenter {
    abstract set Project(project: IProject);
}