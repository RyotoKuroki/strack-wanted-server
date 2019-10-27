import express from 'express';
import WantedsGet from './app.domains.endpoints/bingobook.fetch.endpoint';
import WantedsDelete from './app.domains.endpoints/wanteds.delete.endpoint';
import WantedsUpsert from './app.domains.endpoints/wanteds.upsert.endpoint';
import WantedsDone from './app.domains.endpoints/wanteds.done.endpoint';
import { EntityEnableStates } from 'strack-wanted-meta/dist/consts/states/states.entity.enabled';

const cors = require('cors')({Origin: true});
const router = express.Router();

router.post('/get-wanteds', (req, res, next) => {
    cors(req, res, () => new WantedsGet().Fetch(req, res, next));
});
router.post('/upsert-wanteds', (req, res, next) => {
    cors(req, res, () => new WantedsUpsert().Save(req, res, next));
});
router.post('/done-wanteds', (req, res, next) => {
    cors(req, res, () => new WantedsDone().Done(req, res, next));
});
router.post('/delete-wanteds', (req, res, next) => {
    cors(req, res, () => new WantedsDelete().Remove(req, res, next));
});



router.get('/', (req, res, next) => {
    cors(req, res, () => {
        // return res.send('Hello rest-world!');
        return res.json({
            success: true,
            test: EntityEnableStates.DISABLE
        });
    });
});

export default router;
