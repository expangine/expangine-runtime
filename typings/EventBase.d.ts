import { LinkedNode } from './LinkedNode';
export declare type EventCallback<E, K extends keyof E = any, A extends any[] = EventTypeArgs<E, K>, R = EventTypeResult<E, K>> = (type: K, ...payload: A) => R;
export declare type EventDefinition<A extends any[], R> = (...args: A) => R;
export declare type EventCallbackMap<E> = {
    [K in keyof E]?: LinkedNode<EventCallback<E, K>>;
};
export declare type EventTypeResult<E, K extends keyof E> = E[K] extends EventDefinition<any, infer R> ? R : never;
export declare type EventTypeArgs<E, K extends keyof E> = E[K] extends EventDefinition<infer A, any> ? A : never;
export declare class EventBase<E> {
    private listeners;
    trigger<K extends keyof E, A extends EventTypeArgs<E, K>, R extends EventTypeResult<E, K>>(event: K, ...payload: A): R[];
    hasListeners<K extends keyof E>(event: K): boolean;
    getListeners<K extends keyof E>(event: K, create?: false): LinkedNode<EventCallback<E, K>> | null;
    getListeners<K extends keyof E>(event: K, create: true): LinkedNode<EventCallback<E, K>>;
    on<K extends keyof E>(event: K | K[], handler: EventCallback<E, K>): () => void;
    once<K extends keyof E>(event: K | K[], handler: EventCallback<E, K>): () => void;
    off<K extends keyof E = any>(event?: K | K[], handler?: EventCallback<E, K>): this;
}
