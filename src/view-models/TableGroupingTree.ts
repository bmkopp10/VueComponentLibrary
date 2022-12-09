import RowNode from './RowNode';

export default class TableGroupingTree<T> {
    private f_parentNodes: RowNode<T>[] = [];

    constructor(rowData: Array<T | Array<T>>) {
        let currentParentNode: RowNode<T> | undefined;

        rowData.forEach((row) => {
            if (Array.isArray(row)) {
                currentParentNode?.addChildren(row);
            } else {
                currentParentNode = new RowNode(row);
                this.f_parentNodes.push(currentParentNode);
            }
        });
    }

    public get length(): number {
        return this.toFlatArray().length;
    }

    public sortGroups(compareFn: (a: T, b: T) => number) {
        this.f_parentNodes.sort((a, b) => compareFn(a.value, b.value));
    }

    public toArray(): RowNode<T>[] {
        return this.f_parentNodes;
    }

    public toFlatArray(): RowNode<T>[] {
        return this.f_parentNodes.flatMap((node) => [node, ...node.getChildren()]);
    }
}
