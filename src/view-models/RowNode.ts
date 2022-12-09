export default class RowNode<T> {
    private f_children: RowNode<T>[] = [];
    private f_parent?: RowNode<T>;

    public value: T;

    constructor(value: T, parent?: RowNode<T>) {
        this.value = value;
        this.f_parent = parent;
    }

    public addChildren(children: T[]) {
        this.f_children.push(...children.map((child) => new RowNode(child, this)));
    }

    public getChildren(): RowNode<T>[] {
        return this.f_children;
    }

    public hasChildren(): boolean {
        return this.f_children.length > 0;
    }

    public hasParent(): boolean {
        return !!this.f_parent;
    }
}
