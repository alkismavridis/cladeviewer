import React, {useState} from 'react';
import Tree from "./Tree";
import App from "../../core/App";
import CladeSearchField from "./CladeSearchField";
import FooComponent from "./FooComponent";
import "../css/index.scss";


function AppComponent() {
    const [app,] = useState(() => new App());

    // return <FooComponent />;

    return (
        <div style={{display: "flex", flexDirection: "column", height:"100%"}}>
            <header style={{display:"flex"}}>
                <CladeSearchField app={app} onSelect={c => app.addClade(c, null)} placeholder="Add clade"/>
            </header>
            <Tree app={app} style={{flex: 1}}/>
        </div>
    );
}

export default AppComponent;
