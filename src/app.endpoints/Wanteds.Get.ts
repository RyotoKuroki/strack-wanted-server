import Flow from '../app.db.flows/Flow';
import TrWanted from '../app.db.entities/TrWanted';

export default class WantedsGet {

    public async Get(req, res, next) {
        
        const flow = new Flow();
        flow.Run([TrWanted])
        .then(async (result) => {
            // callback at connection created.
            const wanteds = await TrWanted.find({
                where: {
                    enabled: 'enable'
                }
            });
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
            return res.send(JSON.stringify({
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
    }
}