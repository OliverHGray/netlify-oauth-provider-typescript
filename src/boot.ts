import { name, version } from '../package.json';
import * as mongoose from 'mongoose';
import boot, {
    loadConfig,
    resolveSecrets,
    connectToMongo,
} from '@cosy-software/node-libraries/boot-stages';
import app from './app';

boot(
    loadConfig({
        MONGODB_URI: { required: true },
        PORT: { default: '3000' },
    }),

    resolveSecrets(['MONGODB_URI'] as const),

    connectToMongo(mongoose),

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
                    console.info(`${name}@${version} listening on port ${config.PORT}`);
                });
        },
    },
);
