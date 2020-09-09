import Subject from "../Subject";

export default interface LeafSubject<T> extends Subject<T>{
    get() : T;
}
