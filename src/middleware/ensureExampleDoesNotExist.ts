import { ValidationError } from '@cosy-software/node-libraries/validate';
import { Example } from '../models/Example';

export default ({ example }: { example: Example | null }) => {
    if (example) {
        throw new ValidationError(['Example already exists with this email address.']);
    }
};
