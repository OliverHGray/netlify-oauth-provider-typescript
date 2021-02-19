import { name, version } from '../package.json';
import { boot } from 'boot-chain';
import { resolveSecrets } from 'boot-chain/resolveSecrets';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { number, object, string } from 'yup';
import { AuthorizationCode } from 'simple-oauth2';
import app from './app';

boot(
    resolveSecrets(process.env, {
        prefix: 'SECRET_MANAGER',
        getSecret: (() => {
            const client = new SecretManagerServiceClient();
            return async (name: string) => {
                const [version] = await client.accessSecretVersion({
                    name,
                });
                return version?.payload?.data?.toString();
            };
        })(),
    }),

    {
        name: 'Validate Config',
        description: 'Validating configuration',
        fn: async ({ config }) => ({
            config: await object({
                ALLOWED_ORIGINS: string().defined().required(),
                OAUTH_CLIENT_ID: string().defined(),
                OAUTH_CLIENT_SECRET: string().defined(),
                GIT_HOSTNAME: string(),
                OAUTH_TOKEN_PATH: string(),
                OAUTH_AUTHORIZE_PATH: string(),
                REDIRECT_URL: string().defined(),
                SCOPES: string().default('repo,user').defined(),
                NODE_ENV: string()
                    .oneOf(['production', 'dev'])
                    .default('production')
                    .defined(),
                PORT: number().default(3000).defined(),
            })
                .defined()
                .validate(config, {
                    abortEarly: false,
                    stripUnknown: true,
                })
                .catch(({ errors }) => {
                    throw new Error(errors.join('\n   '));
                }),
        }),
    },

    {
        name: 'OAuth provider',
        description: 'Initialising OAuth provider',
        fn: ({ config }) => ({
            oauth: new AuthorizationCode({
                client: {
                    id: config.OAUTH_CLIENT_ID,
                    secret: config.OAUTH_CLIENT_SECRET,
                },
                auth: {
                    tokenHost: config.GIT_HOSTNAME || 'https://github.com',
                    tokenPath:
                        config.OAUTH_TOKEN_PATH || '/login/oauth/access_token',
                    authorizePath:
                        config.OAUTH_AUTHORIZE_PATH || '/login/oauth/authorize',
                },
            }),
        }),
    },

    {
        name: 'Express',
        description: 'Starting application',
        fn: async ({ config, oauth }) => {
            app(config, oauth)
                .listen(config.PORT)
                .on('error', (error) => {
                    console.error(error);
                })
                .on('listening', () => {
                    console.log(
                        `${name}@${version} listening on port ${config.PORT}`,
                    );
                });
        },
    },
);
