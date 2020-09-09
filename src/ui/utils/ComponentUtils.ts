import {useEffect, useState} from 'react';
import Subject from "../../core/state/Subject";
import Subscription from "../../core/state/Subscription";

export function useRerender() : () => void {
    const [,_reRender] = useState(null);
    return () => _reRender({});
}


export function useSubscription(subject: Subject<any>) {
    const [, forceUpdate] = useState();
    useEffect(() => {
        const subscription = subject.subscribe((data:any) => forceUpdate({}));
        return () => subscription.unsubscribe()
    }, [subject, forceUpdate])
}

export function useSubscriptions(subjects: Subject<any>[]) {
    const [, forceUpdate] = useState();

    useEffect(() => {
        const subscriptions:Subscription[] = subjects.map(s => s.subscribe(data => forceUpdate({})));
        return () => subscriptions.forEach(s => s.unsubscribe())
    }, [...subjects, forceUpdate])
}
