import Subject from "../Subject";

export default interface ArraySubject<T> extends Subject<T[]>{
    getAll() : ReadonlyArray<T>;
    get(index: number) : T;
}
