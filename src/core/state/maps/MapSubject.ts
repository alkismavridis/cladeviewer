import Subject from "../Subject";

export default interface MapSubject<T> extends Subject<any>{
    get(key: string) : T;
}
