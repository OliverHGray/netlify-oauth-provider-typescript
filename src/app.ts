import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import boom from 'express-boom-ts';
import { handleErrors } from './lib/handleErrors';
import { Router } from 'express';
import { route } from 'middleify/express';
import validateGet from './middleware/validateGet';
import retrieveDiagram from './middleware/retrieveExample';
import validatePost from './middleware/validatePost';
import ensureDiagramDoesNotExist from './middleware/ensureExampleDoesNotExist';
import createDiagram from './middleware/createExample';
import { respondWith } from './lib/respond';

export default () =>
    express()
        .use(helmet())
        .use(cors())
        .use(boom())
        .use(express.json())

        .use(
            '/examples',
            Router()
                .get(
                    '/',
                    route(validateGet, retrieveDiagram, respondWith('example')),
                )
                .post(
                    '/',
                    route(
                        validatePost,
                        retrieveDiagram,
                        ensureDiagramDoesNotExist,
                        createDiagram,
                        respondWith('example'),
                    ),
                ),
        )

        .use(handleErrors)

        .all('*', (req, res) => res.boom.notFound());
