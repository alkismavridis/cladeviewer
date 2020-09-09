import CladeData from "./entities/CladeData";
import DummyCladeProvider from "./DummyCladeProvider";
import CladeTree from "./entities/CladeTree";
import RwLeaf from "./state/leaf/RwLeaf";
import LeafSubject from "./state/leaf/LeafSubject";

export default class App {
    /// FIELDS
    readonly  nodeDataProvider = new DummyCladeProvider();
    private loadedData = new Map<number, CladeData>();
    readonly _tree = new RwLeaf<CladeTree>(new CladeTree(this.loadedData));



    /// ACCESSORS
    get tree() : LeafSubject<CladeTree> { return this._tree; }


    /// ACTIONS
    async addClade(clade: CladeData, fallbackParentId: number) {
        const existing = this.loadedData.get(clade.id);
        if (existing != null) return;

        this.loadedData.set(clade.id, clade);
        this._tree.get().addClades([clade], fallbackParentId);
        this._tree.fire();
    }

    async addCladeById(cladeId: number, fallbackParentId: number) : Promise<void> {
        const existing = this.loadedData.get(cladeId);
        if (existing != null) return;

        const cladeToAdd = await this.nodeDataProvider.loadSingle(cladeId);
        if(cladeToAdd == null) return;

        this.loadedData.set(cladeToAdd.id, cladeToAdd);
        this._tree.get().addClades([cladeToAdd], fallbackParentId);
        this._tree.fire();
    }

    async addDirectChildrenOf(cladeId: number) : Promise<void> {
        const cladesToAdd = await this.nodeDataProvider.getDirectChildrenOf(cladeId);
        cladesToAdd.forEach(clade => this.loadedData.set(clade.id, clade));

        this._tree.get().addClades(cladesToAdd, null);
        this._tree.fire();
    }

    async addSpeciesOf(cladeId: number) : Promise<void> {
        const cladesToAdd = await this.nodeDataProvider.getSpeciesUnder(cladeId);
        cladesToAdd.forEach(clade => this.loadedData.set(clade.id, clade));

        this._tree.get().addClades(cladesToAdd, cladeId);
        this._tree.fire();
    }

    async addWithDescendents(cladeId: number) {
        const cladesToAdd = await this.nodeDataProvider.getAllChildrenOf(cladeId);
        cladesToAdd.forEach(clade => this.loadedData.set(clade.id, clade));

        this._tree.get().addClades(cladesToAdd, cladeId);
        this._tree.fire();
    }
}
