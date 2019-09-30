// const cors = require('cors')({Origin: true});
import Flow from '../../app.db.flows/Flow';
import TrWanted from '../../app.db.entities/TrWanted';

export default class PostWanteds {

    // POST/wanteds
    public async PostWanteds(req, res, next) {

        console.log(`post begin`);

        // console.log(`(POST) params : ${JSON.stringify(req.body.wanteds)}`);
        const wanted: TrWanted = req.body.wanteds[0];
        console.log(`name : ${wanted.name}`);
        console.log(`prize : ${wanted.prize_money}`);
        console.log(`warn : ${wanted.warning}`);
        
        /*
        const flow = new Flow();
        
        flow.Run([TrWanted])
        .then(async (result) => {
            // callback at connection created.
            const wanteds = await TrWanted.find();
            result.wanteds = wanteds;
            return result;
        })
        .then((result: any) => {
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
        });
        */
    }
}