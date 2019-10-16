import Datastore from '../app.infrastructure.datastore/Infra.Datastore';
import TrWanted from '../app.db.entities/TrWanted';
import WantedDomain from '../app.domains/WantedDomain';
// import uuid from 'node-uuid';

export default class WantedsUpsert {

    public async Save(req, res, next) {
        
        const params = req.body;
        const dtoWanted: TrWanted = params.wanteds[0];

        const datastore = new Datastore();
        datastore.RunWithTransaction([TrWanted], async (result: any) => {

            const wantedDm = new WantedDomain(datastore);

            // 更新。
            const patchKeys = wantedDm.CreatePatchSpecifyKeys(dtoWanted.uuid, dtoWanted.revision);
            const done = await wantedDm.UpdateDone(patchKeys, dtoWanted.done === WantedDomain.DONE_STATUS__DONE);

            result.target = done;
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