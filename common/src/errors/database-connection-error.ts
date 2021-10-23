import { CustomError, CustomErrorType } from './custom-error'

export class DatabaseConnectionError extends CustomError {
    reason = 'Error connecting to database'
    statusCode: number = 500
    constructor() {
        super('Error connecting to db')
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }
    serializeErrors(): CustomErrorType[] {
        return [{ message: this.reason }]
    }
}
