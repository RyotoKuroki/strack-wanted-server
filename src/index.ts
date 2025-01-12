import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({
    limit: '3mb',
    extended: true,
}));
app.use('/', routes);
app.listen(port);

// for debug.
console.log(`http://localhost:${port}`);

