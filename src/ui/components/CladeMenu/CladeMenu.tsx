import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp, faDove, faInfo, faStar, faTimes} from "@fortawesome/free-solid-svg-icons";
import App from "../../../core/App";
import TreeNode from "../../../core/entities/TreeNode";
import "./CladeMenu.scss"

class Props {
    key?: any;
    x: number;
    y: number;
    node: TreeNode;
    app: App;
    onClose: () => void;
}

export default function CladeMenu(props: Props) {
    const parentNodeId = props.node.parent? props.node.parent.clade.id : null;
    const clade = props.node.clade;

    return <div className="clade-menu" style={{top:props.y+"px", left:props.x+"px"}}>
        {renderBasicInfo()}
        {renderButtons()}
    </div>;


    function renderBasicInfo() {
        return <section className="clade-menu__info">
            <b>{clade.displayName}</b>
            {renderAge()}
            {renderSpeciesNumber()}
        </section>;
    }

    function renderAge() {
        if (clade.ageFromInMiYears == null) {
            return <div>? Million years ago</div>;
        } else {
            return <div>{clade.ageFromInMiYears} - {clade.ageToInMiYears} Million years ago</div>;
        }
    }

    function renderSpeciesNumber() {
        if (clade.speciesFrom == null) {
            return <div>? species</div>;
        } else {
            return <div>{clade.speciesFrom} - {clade.speciesTo} species</div>;
        }
    }

    function renderButtons() {
        return <div className="app__flex-lc">
            <button className="clade-menu__item" title="Show Parent" disabled={props.node.hasRealParent()} onClick={() => {
                props.app.addCladeById(clade.parentId, parentNodeId).then();
                props.onClose();}}>
                <FontAwesomeIcon icon={faChevronUp}/>
            </button>
            <button className="clade-menu__item" title="Show Children" onClick={() => {
                props.app.addDirectChildrenOf(clade.id).then();
                props.onClose();}}>
                <FontAwesomeIcon icon={faChevronDown} />
            </button>
            <button className="clade-menu__item" onClick={() => {
                props.app.addSpeciesOf(clade.id).then();
                props.onClose();}}>
                <FontAwesomeIcon icon={faDove} />
            </button>
            <button className="clade-menu__item" onClick={() => {
                props.app.addWithDescendents(clade.id).then();
                props.onClose();}}>
                <FontAwesomeIcon icon={faStar} />
            </button>
            {props.node.clade.wikiPage?
                <a className="clade-menu__item" href={props.node.clade.wikiPage} target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faInfo} />
                </a> :
                <div className="clade-menu__item">
                    <FontAwesomeIcon icon={faInfo} />
                </div>
            }
            <button className="clade-menu__item" onClick={props.onClose}>
                <FontAwesomeIcon icon={faTimes}/>
            </button>
        </div>;
    }
}
