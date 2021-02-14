import { model as createModel, Document } from 'mongoose';
import { schema, string, GetType, number } from '@cosy-software/node-libraries/meerkat';

export const definition = schema({
    email: string().options({ unique: true }),
    name: string(),
    age: number(),
}).onTransformation({
    transform: {
        _idToId: true,
    },
    omit: {
        __v: true,
    },
});

const exampleSchema = definition.asMongooseSchema();
export type Example = GetType<typeof definition>;
export const exampleModel = createModel<Document & Example>('Example', exampleSchema);
