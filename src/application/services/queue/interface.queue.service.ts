export default interface Queue<T> {
    enqueue(event: T): Promise<void>;
    dequeue(): Promise<T | null>;
    process(event: T): Promise<void>;
    handleFailure(event: T): Promise<void>;
    registerHandler(eventType: string, handler: (event: T) => Promise<void>): void;
}