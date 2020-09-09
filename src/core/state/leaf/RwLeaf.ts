import Subscription from "../Subscription";
import {addSubscription, fireSubscriptions, removeSubscription} from "../StateUtils";
import MutableLeafSubject from "./MutableLeafSubject";
import LeafSubject from "./LeafSubject";
import RwArray from "../arrays/RwArray";
import ArraySubject from "../arrays/ArraySubject";


export default class RwLeaf<T> implements MutableLeafSubject<T> {
    private subs: Subscription[] = [];
    private _value: T;

    constructor(initialValue: T = null, private updater?: (value: T) => void) {
        this._value = initialValue;
    }


    /// VALUE MANAGEMENT
    get() : T { return this._value; }

    set(newValue: T) {
        if (newValue === this._value) return;

        if (this.updater) this.updater(newValue);
        else this.next(newValue);
    }

    next(newValue: T) {
        this._value = newValue;
        fireSubscriptions(this.subs, newValue);
    }

    fire() {
        fireSubscriptions(this.subs, this._value);
    }


    /// SUBSCRIPTION MANAGEMENT
    subscribe(callback: (t: T) => void): Subscription {
        return addSubscription(this, this.subs, callback);
    }

    unsubscribe(sub: Subscription): void {
        removeSubscription(this.subs, sub);
    }
}




export class Foo {
    /// STATE
    private _bar = new RwLeaf<string>("", v => this.handleBarUpdate(v));
    private _barArray = new RwArray<string>([]);


    /// GETTERS
    get bar() : MutableLeafSubject<string> { return this._bar; }
    get barArray() : ArraySubject<string> { return this._barArray; }


    /// ACTIONS
    private handleBarUpdate(newValue: string) {
        if(newValue.indexOf("f") >= 0) return;

        if (newValue === this._bar.get() + "u") {
            this._barArray.push(Math.random() + "");
        }

        this._bar.next(newValue);
    }
}
