
/**
 * This represents a node to be displayed.
 * It provides all the data that the UI needs, and is used in business logic rules.
 *  */
export default class CladeData {
    id: number;
    parentId: number;
    displayName: string;
    isParentClade? = false;
    imageUrl?: string;
    ageFromInMiYears?: number;
    ageToInMiYears?: number;
    speciesFrom?: number;
    speciesTo?: number;
    wikiPage?: string;
}
