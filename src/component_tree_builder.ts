import { Device } from "./device";
import { IComposite } from "./icomponent";
import { IConfig } from "./iconfig";
import { OpcObject } from "./opc_object";
import { OpcVariable } from "./opc_variable";

export interface TreeNode {
    id: string,
    type: string,
    children: TreeNodes;
}

export type TreeNodes = TreeNode[];

export class ComponentTreeBuilder {
    static readonly ID_NAME = 'id';
    static readonly CHILDREN_NAME = 'children';
    static readonly TYPE_NAME = 'type';

    makeTree(cfg: IConfig): TreeNode {
        const tree = this.createNode('root', 'folder');

        const objects = this.makeObjectTree(cfg);
        this.addToTree(objects, 'opcobj', tree);

        const devices = this.makeDeviceTree(cfg);
        this.addToTree(devices, 'device', tree);

        const plugins = this.makePluginTree(cfg);
        this.addToTree(plugins, 'plugin', tree);

        return tree;
    }

    makeObjectTree(cfg: IConfig): TreeNode {
        const tree = this.createNode('objects', 'opcobj');
        cfg.getChildren().filter(child => child instanceof OpcObject || child instanceof OpcVariable)
            .forEach(c => {
                this.makeSubTree(c, tree[ComponentTreeBuilder.CHILDREN_NAME]);
            });
        return tree;
    }

    makePluginTree(cfg: IConfig): TreeNode {
        const tree = this.createNode('plugins', 'plugin');
        cfg.getPlugins().forEach(plugin => {
            this.makeLeaf(plugin.Id, plugin.toString(), tree[ComponentTreeBuilder.CHILDREN_NAME]);
        });
        return tree;
    }

    makeDeviceTree(cfg: IConfig): TreeNode {
        const tree = this.createNode('devices', 'device');
        cfg.getChildren().filter(child => child instanceof Device)
            .forEach(c => {
                this.makeSubTree(c, tree[ComponentTreeBuilder.CHILDREN_NAME]);
            });
        return tree;
    }

    private makeSubTree(c: IComposite, subtree: TreeNodes): void {
        if (c.getChildren().length){
            this.makeBranch(c, subtree);
        } else {
            this.makeLeaf(c.Id, c.toString(), subtree);
        }
    }

    private makeBranch(c: IComposite, subtree: TreeNodes): void {
        const leaf = this.createNode(c.Id, c.toString());
        c.getChildren().forEach(subc => {
            this.makeSubTree(subc, leaf[ComponentTreeBuilder.CHILDREN_NAME]);
        });

        subtree.push(leaf);
    }

    private makeLeaf(id: string, type: string, subtree: TreeNodes): void {
        const leaf = this.createNode(id, type);
        subtree.push(leaf);
    }

    private createNode(id: string, type: string): TreeNode {
        const node = Object.create(null);
        node[ComponentTreeBuilder.ID_NAME] = id;
        node[ComponentTreeBuilder.CHILDREN_NAME] = [];
        node[ComponentTreeBuilder.TYPE_NAME] = type;
        return node;
    }

    private addToTree(what: TreeNode, type: string, where: TreeNode){
        what[ComponentTreeBuilder.TYPE_NAME] = type;
        where[ComponentTreeBuilder.CHILDREN_NAME].push(what);
    }
}
