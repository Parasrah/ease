import { AbstractMessenger } from "../communications/AbstractMessenger";
import { AbstractReceiver } from "../communications/AbstractReceiver";
import { AbstractSignaler } from "./AbstractSignaler";

export abstract class AbstractPeerManager<R extends AbstractReceiver, M extends AbstractMessenger, S extends AbstractSignaler> {
    private receiver: R;
    private messenger: M;
    protected signaler: S;

    constructor(receiver: R, messenger: M, signaler: S) {
        this.receiver = receiver;
        this.messenger = messenger;
        this.signaler = signaler;

        this.getReceiver = this.getReceiver.bind(this);
        this.getMessenger = this.getMessenger.bind(this);
    }

    public getReceiver() {
        return this.receiver;
    }

    public getMessenger() {
        return this.messenger;
    }
}
