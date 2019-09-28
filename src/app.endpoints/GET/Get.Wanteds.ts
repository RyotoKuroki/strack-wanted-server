// const cors = require('cors')({Origin: true});
import Flow from '../../app.db.flows/Flow';
import TrWanted from '../../app.db.entities/TrWanted';

export default class GetWanteds {

    // GET/wanteds
    public async GetWanteds(req, res, next) {

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
            /*
            res.send(JSON.stringify({
                success: false
            }));
            */
        });
    }
}