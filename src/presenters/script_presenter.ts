import { Direction } from '../ibindable';
import { IConfig } from '../iconfig';
import { IProject } from '../iproject';
import { OpcVariable } from '../opc_variable';
import { IPresenter } from '../presenter_registry';
import { Script } from '../script'

export class ScriptPresenter implements IPresenter{
    private cfg?: IConfig;

    get Name(): string {
        return 'script';
    }

    set Project(proj: IProject){
        this.cfg = proj.Config;
    }

    getContent(id: string): string {
        const script = this.cfg!.getChild(id) as Script;
        return script.Content;
    }

    setContent(id: string, content: string): void {
        this.getScript(id).Content = content;
    }

    getOutVariables(id: string): string[] {
        return this.getScript(id).getOutVars();
    }

    getInVariables(id: string): string[] {
        return this.getScript(id).getInVars();
    }

    bind(id: string, scriptVar: string, anotherVar: string): void {
        const v = this.getScript(id).getChild(scriptVar) as OpcVariable;
        const v2 = this.cfg!.getChild(anotherVar) as OpcVariable;
        v.bindTo(v2, Direction.In);
    }

    private getScript(id: string): Script {
        return this.cfg!.getChild(id) as Script;
    }
}