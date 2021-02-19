import { randomBytes } from 'crypto';

export const generateNonce = () => ({
    nonce: randomBytes(32).toString('hex'),
});
