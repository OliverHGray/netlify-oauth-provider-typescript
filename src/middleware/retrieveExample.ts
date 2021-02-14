import { exampleModel } from '../models/Example';

export default async ({ payload }: Context) => ({
    example: await exampleModel.findOne({ email: payload.email }).exec(),
});

type Context = {
    payload: {
        email: string;
    };
};
