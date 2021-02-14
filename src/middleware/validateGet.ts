import { Request } from 'express';
import validate, { yup } from '@cosy-software/node-libraries/validate';

export default async (locals: any, request: Request) => ({
    payload: await validate(schema, request.query),
});

const schema = yup
    .object({
        email: yup.string().email().defined(),
    })
    .defined();
