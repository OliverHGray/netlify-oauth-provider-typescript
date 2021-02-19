import { errorHandler, handle, respond } from 'middleify/express';
import { ValidationError } from 'yup';

export const handleErrors = errorHandler(
    handle(
        ValidationError,
        respond.badRequest.withErrorProperties('message', 'errors'),
    ),

    handle(Error, ({ error }, req, res) => {
        console.error(error.message);
        respond.internal(res);
    }),
);
