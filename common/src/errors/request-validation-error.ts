import { ValidationError } from 'express-validator'
import { CustomError, CustomErrorType } from './custom-error'

export class RequestValidationError extends CustomError {
    statusCode: number = 400
    constructor(public errors: ValidationError[]) {
        super('Invalid request parameters')

        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }
    serializeErrors(): CustomErrorType[] {
        return this.errors.map((error) => ({
            message: error.msg,
            field: error.param,
        }))
    }
}
