import CladeData from "./CladeData";

interface CladeProvider {
    getCladesMatching(newText: string) : Promise<CladeData[]>;
    loadSingle(id:number) : Promise<CladeData>;
    getAllParents(entryPoint:number) : Promise<CladeData[]>;
    getLastCommonAncestorOf(nodes:number[]) : Promise<CladeData>;
    getDirectChildrenOf(parentId: number): Promise<CladeData[]>;
}


export default CladeProvider;
