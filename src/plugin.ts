import { IBuilder } from './builder';
import { ILoader } from './loader';
import { IComposite } from "./icomponent";
import { Component } from "./component";
import { PluginLoader } from './component_loader';

export class Plugin extends Component implements IComposite {
    constructor(id = ''){
        super(id);
    }

    toString(): string {
        return 'plugin';
    }

    build(builder: IBuilder): void {
        builder.startPlugin(this.Id);
        this.props.build(builder);
        builder.endPlugin();
    }

    load(loader: ILoader): void {
        const data = loader.loadComponent(PluginLoader);
        this.id = data.get('id');

        const subloader = loader.createLoader(data.get('content'));
        this.props.load(subloader);
    }
}