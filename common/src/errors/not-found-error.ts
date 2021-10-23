import { CustomError, CustomErrorType } from './custom-error'

export class NotFoundError extends CustomError {
    statusCode: number = 404
    constructor() {
        super('Route not found')
        Object.setPrototypeOf(this, NotFoundError.prototype)
    }
    serializeErrors(): CustomErrorType[] {
        return [{ message: 'Not Found' }]
    }
}
