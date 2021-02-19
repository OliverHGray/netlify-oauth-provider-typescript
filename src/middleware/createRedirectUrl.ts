import { AuthorizationCode } from 'simple-oauth2';
import { randomBytes } from 'crypto';

export const createRedirectUrl = (
    oauth: AuthorizationCode,
    redirectUrl: string,
    scopes: string,
) => () => ({
    redirectUrl: oauth.authorizeURL({
        redirect_uri: redirectUrl,
        scope: scopes,
        state: randomBytes(32).toString('hex'),
    }),
});
