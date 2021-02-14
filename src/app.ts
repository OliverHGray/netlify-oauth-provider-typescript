import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import boom from '@cosy-software/node-libraries/express-boom';
import { useEndpointsAuthentication } from '@cosy-software/node-libraries/authenticate';
import handleErrors from './lib/handleErrors';
import { Router } from 'express';
import { route } from '@cosy-software/node-libraries/middleify/express';
import validateGet from './middleware/validateGet';
import retrieveDiagram from './middleware/retrieveExample';
import validatePost from './middleware/validatePost';
import ensureDiagramDoesNotExist from './middleware/ensureExampleDoesNotExist';
import createDiagram from './middleware/createExample';

export default () =>
    express()
        .use(helmet())
        .use(cors())
        .use(boom())
        .use(useEndpointsAuthentication)
        .use(express.json())

        .use(
            '/examples',
            Router()
                .get(
                    '',
                    route(
                        validateGet,
                        retrieveDiagram,
                        ({ example }, req, res) => res.json(example),
                    ),
                )
                .post(
                    '',
                    route(
                        validatePost,
                        retrieveDiagram,
                        ensureDiagramDoesNotExist,
                        createDiagram,
                        ({ example }, req, res) => res.json(example),
                    ),
                ),
        )

        .use(handleErrors)

        .all('*', (req, res) => res.boom.notFound());
