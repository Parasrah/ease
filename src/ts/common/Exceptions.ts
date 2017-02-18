interface Exception {
    toString(): string;
}

export class NoSuchSubscription implements Exception {
    private message: string;

    constructor() {
        this.message = "No such subscription exists";
    }

    public toString(): string {
        return this.message;
    }
}
