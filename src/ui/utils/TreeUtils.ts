import CladeTree from "../../core/entities/CladeTree";
import TreeNode from "../../core/entities/TreeNode";

export default class TreeUtils {
    static makeTreeDataFrom(tree: CladeTree) {
        const ret = {
            nodes: [],
            edges: [],
        };


        for (const node of tree.nodes.values()) {
            ret.nodes.push(TreeUtils.makeGraphNodeFrom(node));
            if (node.parent != null) {
                ret.edges.push({
                    from: node.id,
                    to: node.parent.id,
                    dashes: !node.hasRealParent()
                    // color: node.hasRealParent() ? { color: 'red'} : null
                });
            }
        }

        return ret;
    }

    private static makeGraphNodeFrom(data: TreeNode) {
        const clade = data.clade;
        const parentNode = data.parent;

        if (clade.imageUrl) {
            return {
                id: data.id,
                shape: "circularImage",
                image: clade.imageUrl,
                title: clade.displayName,
                data: data
            };
        } else return {
            id: data.id,
            label: clade.displayName,
            color: parentNode == null ? "red" : null,
            data: data
        }
    }
}
