import express from 'express';
// import cors from 'cors';
const cors = require('cors')({Origin: true});
import Flow from './db.flows/Flow';
import TrWanted from './db.entities/TrWanted';
import Accessor from './db.accessors/Accessor';

const router = express.Router();

router.get('/wanteds/find', (req, res, next) => {

    cors(req, res, () => {
        const flow = new Flow();
        flow.Run([TrWanted])
        .then(async (result) => {
            // callback at connection created.
            const wanteds = await TrWanted.find();
            result.wanteds = wanteds;
            return result;
        }).then((result: any) => {
            // release connection.
            flow.Release();
            return result;
        })
        .then((result: any) => {
            // response
            res.send(JSON.stringify({
                success: true,
                wanteds: result.wanteds
            }));
        })
        .catch(error => {
            // response on error
            throw new Error(JSON.stringify({
                success: false
            }));
            /*
            res.send(JSON.stringify({
                success: false
            }));
            */
        });
    });
});

export default router;
