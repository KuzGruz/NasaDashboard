import { NextFunction, Request, Response } from 'express'

export class CustomError extends Error {
    constructor(public readonly status: number, public readonly message: string) {
        super(message)
    }

    static BadRequest(message: string): CustomError {
        return new CustomError(400, message)
    }

    static NotFound(message: string): CustomError {
        return new CustomError(404, message)
    }

    static ServerError(message: string): CustomError {
        return new CustomError(500, message)
    }
}

function errorMiddleware(err: CustomError | Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof CustomError) {
        return res.status(err.status).send({
            status: err.status,
            message: err.message
        })
    }
    return res.status(500).send({ message: 'Uncaught error' })
}

export default errorMiddleware
