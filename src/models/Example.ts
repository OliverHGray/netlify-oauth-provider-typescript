import { model as createModel, Document } from 'mongoose';
import { schema, string, GenerateType, number } from 'slender-mongoose';

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

const exampleSchema = definition.generateSchema();
export type Example = GenerateType<typeof definition>;
export const exampleModel = createModel<Document & Example>('Example', exampleSchema);
