import {
    errorHandler,
    handle,
} from '@cosy-software/node-libraries/middleify/express';
import { ValidationError } from '@cosy-software/node-libraries/validate';

export default errorHandler(
    handle(ValidationError, ({ message, errors }, req, res) =>
        res.boom.badRequest(message, { errors }),
    ),

    handle(Error, (error, req, res) => {
        console.error(error);
        res.boom.internal();
    }),
);
