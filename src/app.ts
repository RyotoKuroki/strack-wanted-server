import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';

const app = express();

app.use(bodyParser());
app.use('/', routes);

app.use(bodyParser.urlencoded({ limit:'10mb',extended: true }));

export default app;
