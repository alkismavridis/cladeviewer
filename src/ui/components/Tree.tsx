import React, {Component, createRef} from 'react';

import Graph from "react-graph-vis";

import TreeUtils from "../utils/TreeUtils";
import App from "../../core/App";
import CladeMenu from "./CladeMenu/CladeMenu";
import TreeNode from "../../core/entities/TreeNode";
import Subscription from "../../core/state/Subscription";


interface Props {
    app: App;
    style?: any;
}

function makeConfig(height: number) {
    return {
        layout: {
            hierarchical: {
                enabled: true,
                blockShifting: false,
                levelSeparation: 100,
                nodeSpacing: 150,
                sortMethod: "hubsize",
                direction: "UD",
            }
        },
        edges: {
            color: "#000000"
        },
        height: height + "px"
    };
}

class CladeMenuData {
    node: TreeNode;
    x: number;
    y: number;
}

export default class Tree extends Component {
    //SECTION FIELDS
    props: Props;
    rootRef = createRef<HTMLDivElement>();
    resizeInterval: any;
    subscriptions: Subscription[] = [];
    state: {
        currentHeight:number,
        config:any,
        data:any
        menu:CladeMenuData
    };


    //SECTION LIFE CYCLE
    constructor(props:Props) {
        super(props);

        this.state = {
            currentHeight: 0,
            config: makeConfig(1),
            data: TreeUtils.makeTreeDataFrom(props.app.tree.get()),
            menu: null
        };
    }

    componentDidMount(): void {
        this.resizeInterval = setInterval(() => this.resize(), 1000);
        this.subscriptions.push(this.props.app.tree.subscribe(data => {
            this.setState({
                data: TreeUtils.makeTreeDataFrom(data)
            })
        }));
    }

    componentWillUnmount(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
        clearInterval(this.resizeInterval);
    }


    resize() {
        const div = this.rootRef.current;
        if (div == null) return;
        if (div.offsetHeight === this.state.currentHeight) return;

        this.setState({
            config: makeConfig(div.offsetHeight),
            currentHeight: div.offsetHeight
        });
    }

    closeMenu() {
        this.setState({menu:null});
    }

    handleSelection(event) {
        const id = event.nodes[0];
        if (id == null) {
            this.closeMenu();
            return;
        }

        const node = this.props.app.tree.get().getNode(id);
        if (!node) return;

        const menu = {
          node: node,
          x: event.pointer.DOM.x,
          y: event.pointer.DOM.y + 5
        };
        this.setState({menu:menu});
    }


    /// RENDERING
    render() {
        const events = {
            select: e => this.handleSelection(e),
        };

        return (
            <div style={this.props.style} ref={this.rootRef} className={"Tree__root"}
                 title={this.state.config.height + ""}>
                <Graph
                    graph={this.state.data}
                    options={this.state.config}
                    events={events}
                    getNetwork={network => {
                        //  if you want access to vis.js network api you can set the state in a parent component using this property
                    }}
                />
                {this.state.menu && <CladeMenu
                  x={this.state.menu.x}
                  y={this.state.menu.y}
                  node={this.state.menu.node}
                  app={this.props.app}
                  onClose={() => this.closeMenu()}/>}
            </div>
        );
    }
}
