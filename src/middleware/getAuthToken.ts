import { AuthorizationCode } from 'simple-oauth2';

export const getAuthToken = (
    oauth: AuthorizationCode,
    redirectUrl: string,
) => async ({
    code,
}: Context): Promise<{
    messageType: string;
    messageContent: string;
}> => {
    try {
        const { token } = await oauth.getToken({
            code,
            redirect_uri: redirectUrl,
        });
        return {
            messageType: 'success',
            messageContent: JSON.stringify({
                token: token.access_token,
                provider: 'github',
            }),
        };
    } catch (error) {
        return {
            messageType: 'error',
            messageContent: JSON.stringify(error),
        };
    }
};

type Context = {
    code: string;
};
