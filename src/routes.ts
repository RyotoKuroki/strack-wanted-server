import express from 'express';
import GetWanteds from './app.endpoints/GET/Get.Wanteds';
import PostWanteds from './app.endpoints/POST/Post.Wanteds';
import PutWanteds from './app.endpoints/PUT/Put.Wanteds';

const cors = require('cors')({Origin: true});
const router = express.Router();

router.get('/GET/wanteds', (req, res, next) => {
    cors(req, res, () => new GetWanteds().GetWanteds(req, res, next));
});
router.post('/POST/wanteds', (req, res, next) => {
    cors(req, res, () => new PostWanteds().PostWanteds(req, res, next));
});
router./* TODO: put*/post('/PUT/wanteds', (req, res, next) => {
    cors(req, res, () => new PutWanteds().PutWanteds(req, res, next));
});



router.get('/', (req, res, next) => {
    cors(req, res, () => {
        // return res.send('Hello rest-world!');
        return res.json({
            success: true
        });
    });
});

export default router;
