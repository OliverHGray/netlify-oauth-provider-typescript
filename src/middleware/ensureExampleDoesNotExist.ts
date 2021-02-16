import { Example } from '../models/Example';

export default ({ example }: { example: Example | null }) => {
    if (example) {
        throw new Error('Example already exists with this email address.');
    }
};
