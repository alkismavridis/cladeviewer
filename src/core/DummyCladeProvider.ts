import CladeData from "./entities/CladeData";
import allClades from "../data/AllClades"
import CladeProvider from "./entities/CladeProvider";


/** This would do the http stuff. Should be stateless and have various convenience getters.. */
const ALL_CLADES = listToMap(allClades);
for (const clade of ALL_CLADES.values()) {
    const parent = ALL_CLADES.get(clade.parentId);
    if (parent) parent.isParentClade = true;
}


export default class DummyCladeProvider implements CladeProvider {
    getCladesMatching(newText: string) : Promise<CladeData[]> {
        const toLowerCase = newText.toLocaleLowerCase();
        return new Promise<CladeData[]>(resolve => {
            const result = allClades.filter(clade => clade.displayName.toLocaleLowerCase().indexOf(toLowerCase) >= 0);
            resolve(result);
        });
    }

    getAllChildrenOf(id:number): Promise<CladeData[]> {
        return new Promise<CladeData[]>(resolve => {
            resolve(getAllUnder(id, ALL_CLADES));
        });
    }

    loadSingle(id:number) : Promise<CladeData>{
        return new Promise<CladeData>(resolve => {
            resolve(ALL_CLADES.get(id));
        });
    }


    getAllParents(entryPoint:number) : Promise<CladeData[]> {
        return new Promise<CladeData[]>(resolve => {
            const data = new Map<number, CladeData>();
            addAllParents(entryPoint, data);
            resolve(mapToList(data));
        });
    }

    getLastCommonAncestorOf(nodes: number[]): Promise<CladeData> {
        return new Promise<CladeData>(resolve => {
            if (nodes == null || nodes.length === 0) {
                resolve(null);
            }

            const parents: CladeData[][] = nodes.map(id => getAllParents(id).reverse());
            const maxLength = parents.reduce((prev, current) => Math.max(prev, current.length), 0);
            for (let i = 0; i < maxLength; i++) {
                const currentParrent = parents[0][i];
                if (currentParrent == null) {
                    resolve(null);
                    return;
                }

                for (let j = 1; j < parents.length; ++j) {
                    const currentParentInOtherArray = parents[j][i];
                    if (currentParentInOtherArray == null || currentParentInOtherArray.id !== currentParrent.id) {
                        resolve(parents[0][i-1]);
                        return;
                    }
                }
            }
        });
    }

    getDirectChildrenOf(parentId: number) : Promise<CladeData[]> {
        return new Promise<CladeData[]>(resolve => {
            const data: CladeData[] = [];
            for (const clade of ALL_CLADES.values()) {
                if (clade.parentId === parentId) {
                    data.push(clade);
                }
            }

            resolve(data);
        });
    }

    getSpeciesUnder(parentId: number) {
        //             resolve(getAllUnder(id, ALL_CLADES));
        return new Promise<CladeData[]>(resolve => {
            const speciesChildren = getAllUnder(parentId, ALL_CLADES).filter(c => !c.isParentClade);
            resolve(speciesChildren);
        });
    }
}


function mapToList(map: Map<number, CladeData>) : CladeData[] {
    const asList:CladeData[] = [];
    map.forEach(entry => {
        asList.push(entry);
    });
    return asList;
}

function listToMap(list: CladeData[]) : Map<number, CladeData> {
    const result = new Map<number, CladeData>();
    list.forEach(n => result.set(n.id, n));

    return result;
}

function addAllParents(cladeId:number, target:Map<number, CladeData>) {
    let currentClade = ALL_CLADES.get(cladeId);
    while(currentClade != null) {
        target.set(currentClade.id, currentClade);
        currentClade = ALL_CLADES.get(currentClade.parentId);
    }
}


function getAllParents(entryPoint:number) : CladeData[] {
    const ret:CladeData[] = [];
    let currentClade = ALL_CLADES.get(entryPoint);
    while(currentClade != null) {
        ret.push(currentClade);
        currentClade = ALL_CLADES.get(currentClade.parentId);
    }

    return ret;
}


function getAllUnder(entryPoint:number, allClades:Map<number, CladeData>) : CladeData[] {
    const result = new Map<number, CladeData>();
    const dataMap = new Map<number, CladeData>();
    allClades.forEach(n => dataMap.set(n.id, n));

    let childrenIds = new Set<number>([entryPoint]);
    while(childrenIds.size > 0) {
        childrenIds.forEach(id => {
            const node = dataMap.get(id);
            if (node) {
                result.set(node.id, node);
            }
        });


        const nextChildrenIds = new Set<number>();
        dataMap.forEach(node =>{
            if(childrenIds.has(node.parentId)) {
                nextChildrenIds.add(node.id);
            }
        });

        childrenIds = nextChildrenIds;
    }

    return mapToList(result);
}
