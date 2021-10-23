import { CustomError, CustomErrorType } from './custom-error'

export class NotAuthorizedError extends CustomError {
    statusCode: number = 401
    constructor() {
        super('Not authorized')

        Object.setPrototypeOf(this, NotAuthorizedError.prototype)
    }
    serializeErrors(): CustomErrorType[] {
        return [{ message: 'Not authorized' }]
    }
}
