import ArraySubject from "./ArraySubject";

export default interface MutableArraySubject<T> extends ArraySubject<T>{
    setAll(newValue: T[]) : void;
    set(index:number, newValue: T) : void;
}
