import { name, version } from '../package.json';
import { boot } from 'boot-chain';
import { resolveSecrets } from 'boot-chain/resolveSecrets';
import { object, string } from 'yup';
import { connect } from 'mongoose';
import app from './app';

boot(
    {
        name: 'Validate Config',
        description: 'Validating configuration',
        fn: async () => ({
            config: await object({
                MONGODB_URI: string().defined(),
                PORT: string().default('3000').defined(),
            })
                .defined()
                .validate(process.env, {
                    abortEarly: false,
                    stripUnknown: true,
                }),
        }),
    },

    resolveSecrets(),

    {
        name: 'Mongo',
        description: 'Connecting to Mongo',
        fn: async ({ config }) => {
            return {
                mongoose: await connect(config.MONGODB_URI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                }),
            };
        },
    },

    {
        name: 'Express',
        description: 'Starting application',
        fn: async ({ config }) => {
            app()
                .listen(config.PORT)
                .on('error', (error) => {
                    console.error(error);
                })
                .on('listening', () => {
                    console.info(
                        `${name}@${version} listening on port ${config.PORT}`,
                    );
                });
        },
    },
).catch(console.error);
