import { IUser } from './user';
import { ISaveable } from './isaveable';
import { IModifiable } from './imodifiable';
import { IBuildable, IBuilder } from './builder';
import { ILoadable, ILoader } from './loader';
import { UserLoader } from './component_loader';

export class Users implements ISaveable, IModifiable, IBuildable, ILoadable {
    private users: IUser[];
    private modified = false;
    private saved = false;

    constructor(){
        this.users = [];
    }

    addUser(login: string, password: string): void {
        if (login !== "" && !this.hasUser(login)){
            this.users.push({
                "login": login,
                "password": password,
            });

            this.modified = true;
        }
    }

    getLogins(): string[] {
        return this.users.map((user) => user.login);
    }

    hasUser(login: string): boolean {
        return this.users.some((user) => user.login == login);
    }

    getPassword(login: string): string {
        const found = this.users.find((user) => user.login == login)
        if (found){
            return found.password;
        }
        return "";
    }

    removeUser(login: string): void{
        const i: number = this.users.findIndex((user) => user.login == login);
        if (i != -1){
            this.users.splice(i, 1);
            this.modified = true;
        }
    }

    get Count(): number {
        return this.users.length;
    }

    build(builder: IBuilder): void {
        builder.startUsers();
        this.users.forEach(user => builder.buildUser(user.login, user.password));
        builder.endUsers();
    }

    save(): void {
        this.saved = true;
        this.modified = false;
    }

    load(loader: ILoader): void {
        [...loader.loadComponents(UserLoader)].forEach(user => {
            this.addUser(user.get('login'), user.get('password'));
        });
    }

    wasSaved(): boolean {
        return this.saved;
    }

    isModified(): boolean {
        return this.modified;
    }
}