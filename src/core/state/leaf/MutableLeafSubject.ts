import LeafSubject from "./LeafSubject";

export default interface MutableLeafSubject<T> extends LeafSubject<T>{
    set(newValue: T) : void;
}
