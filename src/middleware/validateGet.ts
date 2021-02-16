import { Request } from 'express';
import { object, string } from 'yup';

export default async (locals: any, request: Request) => ({
    payload: await schema.validate(request.query, {
        abortEarly: false,
        stripUnknown: true,
    }),
});

const schema = object({
    email: string().email().defined(),
}).defined();
