export interface TreeNodeJSON<Type> {
    data: Type
    children: TreeNodeJSON<Type>[]
}

export class TreeNode<Type> {

    protected data: Type
    protected level: number
    protected index: number
    protected pathEnumeration: number[]
    protected parent: TreeNode<Type>
    protected children: TreeNode<Type>[]

    constructor(parent: TreeNode<Type>, data: Type) {
        this.parent = parent
        this.data = data
        if (parent) {
            this.level = parent.level + 1
            this.index = parent.children.length + 1
            this.pathEnumeration = [...parent.pathEnumeration, this.index]
        } else {
            this.level = 1
            this.index = 1
            this.pathEnumeration = [0]
        }
        this.children = []
    }

    public getPathEnumeration(): string {
        return this.pathEnumeration.slice(1).join('_')
    }

    public getData(): Type {
        return this.data
    }

    public setData(data: Type): this {
        this.data = data
        return this
    }

    public getLevel(): number {
        return this.level
    }

    public getParent(): TreeNode<Type> {
        return this.parent
    }

    public getChildren(): TreeNode<Type>[] {
        return this.children
    }

    public addChild(data: Type): this {
        this.children.push(new TreeNode(this, data))
        return this
    }

    public isLeaf(): boolean {
        return this.children.length == 0
    }

    public forEachChild(fn: (value: TreeNode<Type>) => any): this {
        this.children.forEach(fn)
        return this
    }

    public getFirstChild(): TreeNode<Type> {
        return this.children[0]
    }

    public getLastChild(): TreeNode<Type> {
        return this.children[this.children.length - 1]
    }

    public toJSON(): TreeNodeJSON<Type> {
        const data = this.data
        let children = this.children.map(child => child.toJSON())
        if (children.length == 0) {
            children = null
        }
        return {data, children}
    }

}
