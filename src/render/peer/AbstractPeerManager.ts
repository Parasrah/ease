import { AbstractSignaler } from "./AbstractSignaler";
import { AbstractMessenger } from "./communications/AbstractMessenger";
import { AbstractReceiver } from "./communications/AbstractReceiver";

export abstract class AbstractPeerManager<R extends AbstractReceiver, M extends AbstractMessenger, S extends AbstractSignaler> {
    private receiver: R;
    private messenger: M;
    protected signaler: S;

    constructor(receiver: R, messenger: M, signaler: S) {
        this.receiver = receiver;
        this.messenger = messenger;
        this.signaler = signaler;

        // Bindings
        this.getReceiver = this.getReceiver.bind(this);
        this.getMessenger = this.getMessenger.bind(this);
    }

    /**
     * @this {@link AbstractPeerManager}
     */
    public getReceiver() {
        return this.receiver;
    }

    /**
     * @this {@link AbstractPeerManager}
     */
    public getMessenger() {
        return this.messenger;
    }

    /**
     * Cleanup the peer manager
     */
    public close() {
        this.signaler.close();
    }
}
