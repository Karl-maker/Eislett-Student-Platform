import logger from "../log";
import Queue from "./interface.queue.service";

export default abstract class AbstractQueue<T extends { type: string; payload: any }> implements Queue<T> {
    private handlers: { [key: string]: (event: T) => Promise<void> } = {};

    abstract enqueue(event: T): Promise<void>;
    abstract dequeue(): Promise<T | null>;

    registerHandler(eventType: string, handler: (event: T) => Promise<void>): void {
        this.handlers[eventType] = handler;
    }

    async process(event: T): Promise<void> {
        try {
            await this.handleEvent(event);
        } catch (error) {
            logger.error(`Failed to process event: ${error}`);
            await this.handleFailure(event);
        }
    }

    async handleFailure(event: T): Promise<void> {
        const maxRetries = 3;
        let attempts = 0;

        while (attempts < maxRetries) {
            try {
                await this.handleEvent(event);
                return;
            } catch (error) {
                attempts += 1;
                logger.error(`Retry ${attempts} for event failed: ${error}`);
            }
        }

        logger.error(`Event failed after ${maxRetries} retries.`);
    }

    protected async handleEvent(event: T): Promise<void> {
        const handler = this.handlers[event.type];
        if (handler) {
            await handler(event);
        } else {
            throw new Error(`No handler registered for event type: ${event.type}`);
        }
    }
}