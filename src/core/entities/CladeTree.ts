import TreeNode from "./TreeNode";
import CladeData from "./CladeData";
import CladeProvider from "./CladeProvider";

export default class CladeTree {
    readonly nodes = new Map<number, TreeNode>();


    /// LIFE CYCLE
    constructor(private clades:ReadonlyMap<number, CladeData>) {}

    static async buildTreeFrom(clades:ReadonlyMap<number, CladeData>, cladeProvider:CladeProvider, cladeAdder:(CladeData) => void) : Promise<CladeTree> {
        const ret = new CladeTree(clades);

        addAll(clades.values(), ret.nodes);
        connectAllMatchingParents(ret.nodes);
        await fillTheGaps(ret.nodes, cladeProvider, cladeAdder);

        return ret;
    }

    static createEmpty() {
        return new CladeTree(new Map());
    }


    /// INFOS
    getNode(id:number) : TreeNode { return this.nodes.get(id); }

    /// ACTIONS
    addClades(clades:CladeData[], fallbackParentId:number) {
        const fallbackParent = fallbackParentId == null?
            null :
            this.nodes.get(fallbackParentId);

        clades.forEach(clade => {
            if (this.nodes.has(clade.id)) return; // clade already here.

            const parentNode = this.nodes.get(clade.parentId) || fallbackParent;

            const newNode = new TreeNode(parentNode, clade);
            this.nodes.set(clade.id, newNode);
            this.connectChildrenTo(newNode);
        });
    }


    /// UTILS
    private connectChildrenTo(parentNode: TreeNode) {
        for (const node of this.nodes.values()) {
            if (node.clade.parentId === parentNode.clade.id) {
                node.parent = parentNode;
            }
        }
    }
}


async function fillTheGaps(target: Map<number, TreeNode>, cladeProvider: CladeProvider, cladeAdder:(CladeData) => void) {
    // 1. Find the root nodes
    const topLevelIds:number[] = [];
    for (const node of target.values()) {
        if (node.parent == null) {
            topLevelIds.push(node.clade.id);
        }
    }

    if (topLevelIds.length <= 1) {
        return;
    }

    const lastCommonAncestor = await cladeProvider.getLastCommonAncestorOf(topLevelIds);
    if (lastCommonAncestor == null || topLevelIds.includes(lastCommonAncestor.id)) {
        return;
    }


    // 2. Integrate new clades
    const newRoot = new TreeNode(null, lastCommonAncestor);
    target.set(lastCommonAncestor.id, newRoot);
    cladeAdder(newRoot);

    const newRootChilden = await cladeProvider.getDirectChildrenOf(newRoot.id);
    newRootChilden.forEach(child => {
        target.set(child.id, new TreeNode(newRoot, child));
        cladeAdder(newRoot);
    });


    // 3. Fill the gaps
    topLevelIds.forEach(orphanId => {
        const orphan = target.get(orphanId);
        if (orphan != null) orphan.parent = newRoot;
    });
}

function addAll(data: IterableIterator<CladeData>, target:Map<number, TreeNode>) {
    for (const cladeData of data) {
        const node = new TreeNode(null, cladeData);
        target.set(cladeData.id, node);
    }
}


function connectAllMatchingParents(target:Map<number, TreeNode>) {
    for (const node of target.values()) {
        const parent = target.get(node.clade.parentId);
        node.parent = parent;
    }
}
