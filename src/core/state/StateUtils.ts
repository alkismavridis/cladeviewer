import Subject from "./Subject";
import Subscription from "./Subscription";

export function removeSubscription(subscriptions: Subscription[], subscriptionToRemove:Subscription) {
    const indexToRemove = subscriptions.findIndex(s => s === subscriptionToRemove);
    if (indexToRemove >= 0) {
        subscriptions.splice(indexToRemove, 1);
    }
}

export function addSubscription<T>(provider: Subject<T>, subscriptions: Subscription[], callback: (t:T) => void) : Subscription {
    const ret = new Subscription(provider, callback);
    subscriptions.push(ret);
    return ret;
}

export function fireSubscriptions<T>(subscriptions:Subscription[], newValue: T) {
    subscriptions.forEach(s => {
        try {
            s.callback && s.callback(newValue);
        } catch (e) {
            console.error(e);
        }
    });
}
