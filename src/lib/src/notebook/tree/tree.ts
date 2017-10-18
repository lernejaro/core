import {TreeNode, TreeNodeJSON} from './tree-node'

export class Tree<Type> {

    protected root: TreeNode<Type>

    constructor(root: TreeNode<Type>) {
        this.root = root
    }

    public getRoot(): TreeNode<Type> {
        return this.root
    }

    public toJSON(): TreeNodeJSON<Type> {
        return this.root.toJSON()
    }

}
