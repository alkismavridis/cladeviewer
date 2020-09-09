import CladeData from "./CladeData";

export default class TreeNode {
    readonly id: number;
    readonly clade: CladeData;
    parent: TreeNode;

    constructor(parent: TreeNode, clade: CladeData) {
        this.id = clade.id;
        this.parent = parent;
        this.clade = clade;
    }

    /** Some times we dont load all the clades between two spots. This means that our parent node on the tree is not always our parent clade.
     * This method determines whether this is the case
     * */
    hasRealParent(): boolean {
        return this.parent != null && this.parent.clade.id === this.clade.parentId;
    }
}
