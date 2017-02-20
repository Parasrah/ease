interface IException {
    toString(): string;
}

export class NoSuchSubscription implements IException {
    private message: string;

    constructor() {
        this.message = "No such subscription exists";
    }

    public toString(): string {
        return this.message;
    }
}
