import { exampleModel } from '../models/Example';

export default async ({ payload }: Context) => ({
    example: await exampleModel.create({
        email: payload.email,
        name: payload.name,
        age: payload.age,
    }),
});

type Context = {
    payload: {
        email: string;
        name: string;
        age: number;
    };
};
