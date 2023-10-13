export class ResponseFormat implements TResponse {
    code: string
    message: string
    data: any
    constructor(code: string, message: string, data: any) {
        this.code = code
        this.message = message
        this.data = data
    }
}
export type TResponse = {
    code: string
    message: string
    data: any
}