import DataStore from '../app.infras/infra.datastores/DataStore';
import { TrWanted } from '../app.entities/TrWanted';
import WantedDomain from '../app.domains/Wanted.Domain';
// import uuid from 'node-uuid';

export default class WantedsDelete {

    public async Delete(req, res, next) {
        
        const params = req.body;
        const whois: TrWanted = params.whois;
        const dtoWanted: TrWanted = params.wanteds[0];
        
        const datastore = new DataStore();
        await datastore.Init([TrWanted]);
        datastore.RunWithTransaction(async (result: any) => {

            // 論理削除。
            const wantedDm = new WantedDomain(datastore);
            const patchKeys = wantedDm.CreatePatchSpecifyKeys(dtoWanted.uuid, dtoWanted.revision);
            const target = await wantedDm.Remove(patchKeys);
            
            result.target = target;
            return result;
        })
        .then(async (result: any) => {
            return res.send(JSON.stringify({
                success: true,
                wanteds: [result.target]
            }));
        })
        .catch(async (error: any) => {
            throw new Error(JSON.stringify({
                success: false,
                reason: error
            }));
        });
    }
}