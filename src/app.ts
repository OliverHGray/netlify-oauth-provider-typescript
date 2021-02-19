import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import handlebars from 'express-handlebars';
import morgan from 'morgan';
import { redirectTo, respond, route } from 'middleify/express';
import { handleErrors } from './lib/handleErrors';
import { AuthorizationCode } from 'simple-oauth2';
import { createRedirectUrl } from './middleware/createRedirectUrl';
import { validateCallback } from './middleware/validateCallback';
import { getAuthToken } from './middleware/getAuthToken';

export default (config: Config, oauth: AuthorizationCode) =>
    express()
        .use(
            helmet({
                contentSecurityPolicy: {
                    directives: {
                        defaultSrc: `'self'`,
                        scriptSrc: `'unsafe-inline'`,
                    },
                },
            }),
        )
        .use(cors())
        .use(express.json())
        .engine('handlebars', handlebars())
        .set('view engine', 'handlebars')
        .set('views', `${__dirname}/views`)
        .use(morgan(':method :url'))

        .get(
            '/auth',
            route(
                createRedirectUrl(oauth, config.REDIRECT_URL, config.SCOPES),
                redirectTo('redirectUrl'),
            ),
        )

        .get(
            '/callback',
            route(
                validateCallback,
                getAuthToken(oauth, config.REDIRECT_URL),
                ({ messageType, messageContent }, req, res) => {
                    res.render('callback', {
                        allowedOrigins: config.ALLOWED_ORIGINS,
                        messageType,
                        messageContent,
                        layout: false,
                    });
                },
            ),
        )

        .use(handleErrors)

        .all('*', route(respond.notFound()));

export type Config = {
    ALLOWED_ORIGINS: string;
    REDIRECT_URL: string;
    SCOPES: string;
};
