import Subject from "./Subject";

export default class Subscription {
    constructor(private provider: Subject<any>, public readonly callback: Function) {
        console.log("I subscribe!");
    }

    unsubscribe() {
        console.log("I unsubscribe!");
        this.provider.unsubscribe(this);
    }
}
