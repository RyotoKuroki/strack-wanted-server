import Flow from '../app.flows/Flow';
import TrWanted from '../app.db.entities/TrWanted';

export default class WantedsGet {

    public async Get(req, res, next) {

        const flow = new Flow();
        flow.Run([TrWanted])
        .then(async (result: any) => {
            const wanteds = await TrWanted.find({
                where: {
                    enabled: 'enable'
                }
            });
            result.wanteds = wanteds;
            return result;
        })
        .then(async (result: any) => {
            // await flow.Release();
            return res.send(JSON.stringify({
                success: true,
                wanteds: result.wanteds
            }));
        })
        .catch(async (error: any) => {
            // await flow.Release();
            throw new Error(JSON.stringify({
                success: false
            }));
        });
    }
}