import { IProject } from "../iproject";
import { IPresenter } from "../presenter_registry";
import { Users } from "../users";

export class UsersPresenter implements IPresenter {
    private users?: Users;

    constructor(){
    }

    get Name(): string {
        return 'user';
    }

    set Project(proj: IProject){
        const cfg = proj.Config;
        this.users = cfg.getUsers();
    }

    addUser(name: string, password: string): void {
        this.users!.addUser(name, password);
    }

    getLogins(): string[] {
        return this.users!.getLogins();
    }

    changeUser(oldLogin: string, newLogin: string, newPassword: string): void {
        this.users!.removeUser(oldLogin);
        this.users!.addUser(newLogin, newPassword);
    }

    getPasswordByLogin(login: string): string {
        return this.users!.getPassword(login);
    }

    removeUser(login: string): void {
        this.users!.removeUser(login);
    }

    removeAll(): void {
        this.users!.getLogins().forEach(login => this.users!.removeUser(login));
    }
}