import express from 'express';
import GetWanteds from './app.endpoints/GET/Get.Wanteds';

const cors = require('cors')({Origin: true});
const router = express.Router();

router.post('/GET/wanteds', (req, res, next) => cors(req, res, () => new GetWanteds().GetWanteds(req, res, next)));

export default router;
