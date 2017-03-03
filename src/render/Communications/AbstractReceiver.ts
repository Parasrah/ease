import { IControlMessage } from "../Messages/ControlMessage";

export interface ISubscription {
    event: string;
    listeners: Function[];
}

export abstract class AbstractReceiver {
    protected subs: ISubscription[];

    constructor() {
        this.subs = [];
    }

    public on = (event: string, fn: Function) => {
        for (const sub of this.subs) {
            if (sub.event === event) {
                sub.listeners.push(fn);
            }
        }
    }

    protected handleMessage<T extends IControlMessage>(message: T) {
        for (const sub of this.subs) {
            if (sub.event === message.type) {
                for (const listener of sub.listeners) {
                    listener(message);
                }
            }
        }
    }
}
