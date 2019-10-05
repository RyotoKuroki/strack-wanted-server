import express from 'express';
import WantedsGet from './app.endpoints/Wanteds.Get';
import WantedsDelete from './app.endpoints/Wanteds.Delete';
import WantedsUpsert from './app.endpoints/Wanteds.Upsert';
import WantedsDone from './app.endpoints/Wanteds.Done';

const cors = require('cors')({Origin: true});
const router = express.Router();

router.post('/get-wanteds', (req, res, next) => {
    cors(req, res, () => new WantedsGet().Get(req, res, next));
});
router.post('/upsert-wanteds', (req, res, next) => {
    cors(req, res, () => new WantedsUpsert().Save(req, res, next));
});
router.post('/done-wanteds', (req, res, next) => {
    cors(req, res, () => new WantedsDone().Save(req, res, next));
});
router.post('/delete-wanteds', (req, res, next) => {
    cors(req, res, () => new WantedsDelete().Delete(req, res, next));
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
