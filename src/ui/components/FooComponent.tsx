import React, {useState} from 'react';
import {Foo} from "../../core/state/leaf/RwLeaf";
import {useSubscriptions} from "../utils/ComponentUtils";

class Props {
    key?: any;
}

export default function FooComponent(props: Props) {
    const [foo,] = useState(() => new Foo());
    useSubscriptions([foo.bar, foo.barArray]);

    return <div className="FooComponent__root">
        Hello from FooComponent
        <input type="text" value={foo.bar.get()} onChange={e => foo.bar.set(e.target.value)}/>

        {foo.barArray.getAll().map((el, i) => <div key={i}>{el}</div>)}
    </div>;
}
