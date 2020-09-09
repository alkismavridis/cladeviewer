import Subscription from "../Subscription";
import {addSubscription, fireSubscriptions, removeSubscription} from "../StateUtils";
import MutableMapSubject from "./MutableMapSubject";


export default class RwMap<T> implements MutableMapSubject<T> {
    private subs: Subscription[] = [];
    private _value: any;

    constructor(initialValue: any, private updater?: (value: any) => void) {
        this._value = initialValue;
    }


    /// VALUE MANAGEMENT
    get(key: string) : T { return this._value[key]; }

    set(key: string, newValue: T) {
        const newArray = {...this._value, [key]: newValue};
        this.setAll(newArray);
    }

    setAll(newValue: any) {
        if (newValue === this._value) return;

        if (this.updater) this.updater(newValue);
        else this.next(newValue);
    }

    next(newValue: any) {
        if (newValue === this._value) return;
        this._value = newValue;
        fireSubscriptions(this.subs, newValue);
    }


    /// SUBSCRIPTION MANAGEMENT
    subscribe(callback: (t: any) => void): Subscription {
        return addSubscription(this, this.subs, callback);
    }

    unsubscribe(sub: Subscription): void {
        removeSubscription(this.subs, sub);
    }
}
