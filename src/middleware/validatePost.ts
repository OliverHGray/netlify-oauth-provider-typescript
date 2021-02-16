import { Request } from 'express';
import { object, string, number } from 'yup';

export default async (_locals: any, request: Request) => ({
    payload: await schema.validate(request.body, {
        abortEarly: false,
        stripUnknown: true,
    }),
});

const schema = object({
    email: string().email().defined(),
    name: string().defined(),
    age: number().positive().integer().defined(),
}).defined();
