import { Request, Response } from 'express';

export const respond = (code: number) => (
    context: any,
    req: Request,
    res: Response,
) => res.status(code).send();

export const respondWith = <Property extends string>(prop: Property) => (
    context: { [key in Property]: any },
    req: Request,
    res: Response,
) => res.json(context[prop]);
