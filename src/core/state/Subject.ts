import Subscription from "./Subscription";

export default interface Subject<T> {
    subscribe(a: (t: T) => void): Subscription;
    unsubscribe(sub: Subscription): void;
}
