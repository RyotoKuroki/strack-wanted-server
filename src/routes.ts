import express from 'express';
import WantedsFetchEndpoint from './app.domains.endpoints/wanteds.fetch.endpoint';
import WantedsDeleteEndpoint from './app.domains.endpoints/wanteds.delete.endpoint';
import WantedsUpsertEndpoint from './app.domains.endpoints/wanteds.upsert.endpoint';
import WantedsDoneEndpoint from './app.domains.endpoints/wanteds.done.endpoint';
import { EntityEnableStates } from 'strack-wanted-meta/dist/consts/states/states.entity.enabled';

const cors = require('cors')({Origin: true});
const router = express.Router();

// TODO: change to 'get'
router.get('/get-wanteds', (req, res, next) => {
    cors(req, res, () => new WantedsFetchEndpoint(req, res).ExecuteTemplateMethod(req.body));
});

router.post('/upsert-wanted', (req, res, next) => {
    cors(req, res, () => new WantedsUpsertEndpoint(req, res).ExecuteTemplateMethod(req.body));
});
router.post('/done-wanted', (req, res, next) => {
    cors(req, res, () => new WantedsDoneEndpoint(req, res).ExecuteTemplateMethod(req.body));
});
router.post('/delete-wanted', (req, res, next) => {
    cors(req, res, () => new WantedsDeleteEndpoint(req, res).ExecuteTemplateMethod(req.body));
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
