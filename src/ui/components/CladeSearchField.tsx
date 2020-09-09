import React, {createRef, CSSProperties, useEffect, useRef, useState} from 'react';
import App from "../../core/App";
import CladeData from "../../core/entities/CladeData";

interface Props {
    onSelect?: (d:CladeData) => void;
    app:App,
    placeholder?: string;
    style?: CSSProperties;
}




export default function CladeSearchField(props: Props) {
    /// State
    const [areOptionsHidden, setHideOptions] = useState(true);
    const [text, setText] = useState("");
    const [options, setOptions] = useState(null as CladeData[]);
    const rootRef = useRef<HTMLDivElement>();


    /// handlers
    async function handleTextChange(newText:string) {
        if (!newText) {
            setOptions(null);
        } else {
            setOptions(await props.app.nodeDataProvider.getCladesMatching(newText));
        }
        setText(newText);
        showOptions();
    }

    function selectNode(node:CladeData) {
        props.onSelect(node);
        hideOptions();
        setText(node.displayName);
    }

    function showOptions() {
        if (!areOptionsHidden) return;

        setHideOptions(false);
        document.body.addEventListener("click", captureOutsideClick);
    }

    function captureOutsideClick(e:Event) {
        if(rootRef.current == null || !rootRef.current.contains(e.target as any)) {
            hideOptions();
        }
    }

    function hideOptions() {
        setHideOptions(true);
        document.body.removeEventListener("click", captureOutsideClick);
    }


    /// render
    function renderOptions() {
        if (areOptionsHidden || !options || options.length === 0) return null;
        return <div className="CladeSearchField__options">
            {options.map(opt => <div
                className="CladeSearchField__option"
                onClick={e => selectNode(opt)}
                key={opt.id}>
                {opt.displayName}
            </div>)}
        </div>;
    }

    return (
        <div style={props.style} className="CladeSearchField_root" ref={rootRef}>
            <input
                value={text}
                onChange={e => handleTextChange(e.target.value)}
                placeholder={props.placeholder}
                className="CladeSearchField__input"/>
            <div style={{height:"0", width:"100%", position:"relative"}}>{renderOptions()}</div>
        </div>
    );
}
