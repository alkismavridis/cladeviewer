import MapSubject from "./MapSubject";

export default interface MutableMapSubject<T> extends MapSubject<any>{
    set(key: string, value: T);
}
