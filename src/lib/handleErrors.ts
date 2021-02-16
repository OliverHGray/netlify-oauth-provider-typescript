import { errorHandler, handle } from 'middleify/express';
import { ValidationError } from 'yup';

export const handleErrors = errorHandler(
    handle(ValidationError, ({ errors }, req, res) =>
        res.boom.badRequest('Validation failed', { errors }),
    ),

    handle(Error, (error, req, res) => {
        console.error(error.message);
        res.boom.internal();
    }),
);
