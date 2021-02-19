import { Request } from 'express';
import { object, string } from 'yup';

export const validateCallback = async (locals: any, request: Request) =>
    await schema.validate(request.query, {
        abortEarly: false,
        stripUnknown: true,
    });

const schema = object({
    code: string().defined().required(),
}).defined();
