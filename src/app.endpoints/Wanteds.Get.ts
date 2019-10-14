import Flow from '../app.db.flows/Flow';
import TrWanted from '../app.db.entities/TrWanted';
import WantedDomain from '../app.domains/WantedDomain';

export default class WantedsGet {

    public async Get(req, res, next) {

        const flow = new Flow();
        flow.Run([TrWanted])
        .then(async (result: any) => {

            const wantedDm = new WantedDomain(flow);
            const wanteds = await wantedDm.FindAll(WantedDomain.ENABLED_STATUS__ENABLED);
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