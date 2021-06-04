export class PromiseResponse {
    public status: string;
    public message: string;
    public parameter: string;
    constructor(status: string, message?: string, parameter?: string) {
        this.status = status;
        this.message = message!;
        this.parameter = parameter!;
    }
}