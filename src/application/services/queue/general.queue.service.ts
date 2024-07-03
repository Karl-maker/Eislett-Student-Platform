import logger from "../log";
import AbstractQueue from "./abstract.queue.service";

export interface Event<Payload> {
    type: string;
    payload: Payload;
}

export default class NodeQueue extends AbstractQueue<Event<any>> {
    private queue: Event<any>[] = [];

    async enqueue(event: Event<any>): Promise<void> {
        this.queue.push(event);
        console.log(`Event enqueued: ${JSON.stringify(event)}`);
    }

    async dequeue(): Promise<Event<any> | null> {
        return this.queue.shift() || null;
    }
}
