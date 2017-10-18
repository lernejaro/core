import {TreeNode} from '../tree/tree-node'
import {Tree} from '../tree/tree'

export interface NodeDataTableOfContent {
    id: string
    title: string
}

export type TreeNodeTableOfContent = TreeNode<NodeDataTableOfContent>
export type TreeTableOfContent = Tree<NodeDataTableOfContent>
