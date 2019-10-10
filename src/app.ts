import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import Logger from './app.logger/Logger';

const app = express();

app.use(bodyParser({
    limit: '5mb',
    extended: true,
}));
app.use('/', routes);

Logger.Test();

export default app;
