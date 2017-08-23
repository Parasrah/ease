import { IControlMessage } from "../messages/ControlMessage";

export interface ISubscription {
    event: string;
    listeners: Array<(message: IControlMessage) => void>;
}

export abstract class AbstractReceiver {
    protected subs: ISubscription[];

    constructor() {
        this.subs = [];
    }

    public on<T extends IControlMessage>(event: string, fn: (message?: T) => void) {
        for (const sub of this.subs) {
            if (sub.event === event) {
                sub.listeners.push(fn);
            }
        }
    }

    protected handleMessage = (jsonMessage: string) => {
        const message = JSON.parse(jsonMessage);
        for (const sub of this.subs) {
            if (sub.event === message.type) {
                for (const listener of sub.listeners) {
                    listener(message);
                }
            }
        }
    }
}
