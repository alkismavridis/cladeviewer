import Subscription from "../Subscription";
import {addSubscription, fireSubscriptions, removeSubscription} from "../StateUtils";
import MutableLeafSubject from "../leaf/MutableLeafSubject";
import MutableArraySubject from "./MutableArraySubject";


export default class RwArray<T> implements MutableArraySubject<T> {
    private subs: Subscription[] = [];
    private _value: T[];

    constructor(initialValue: T[], private updater?: (value: T[]) => void) {
        this._value = initialValue;
    }


    /// VALUE MANAGEMENT
    getAll() : ReadonlyArray<T> { return this._value; }
    get(index: number) : T { return this._value[index]; }

    set(index: number, newValue: T) {
        const newArray = this._value.slice();
        newArray[index] = newValue;
        this.setAll(newArray);
    }

    setAll(newValue: T[]) {
        if (newValue === this._value) return;

        if (this.updater) this.updater(newValue);
        else this.next(newValue);
    }

    push(newElement: T) { this.setAll([...this._value, newElement]); }


    next(newValue: T[]) {
        if (newValue === this._value) return;
        this._value = newValue;
        fireSubscriptions(this.subs, newValue);
    }


    /// SUBSCRIPTION MANAGEMENT
    subscribe(callback: (t: T[]) => void): Subscription {
        return addSubscription(this, this.subs, callback);
    }

    unsubscribe(sub: Subscription): void {
        removeSubscription(this.subs, sub);
    }
}
