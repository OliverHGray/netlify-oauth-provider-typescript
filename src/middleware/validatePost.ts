import { Request } from 'express';
import validate, { yup } from '@cosy-software/node-libraries/validate';

export default async (_locals: any, request: Request) => ({
    payload: await validate(schema, request.body),
});

const schema = yup
    .object({
        email: yup.string().email().defined(),
        name: yup.string().defined(),
        age: yup.number().positive().integer().defined(),
    })
    .defined();
