import Flow from '../app.db.flows/Flow';
import TrWanted from '../app.db.entities/TrWanted';
import WantedDomain from '../app.domains/WantedDomain';
// import uuid from 'node-uuid';

export default class WantedsUpsert {

    public async Save(req, res, next) {
        
        const params = req.body;
        const dtoWanted: TrWanted = params.wanteds[0];

        const flow = new Flow();
        flow.RunWithTransaction([TrWanted], async (result: any) => {

            const wantedDm = new WantedDomain(flow);
            const target = await wantedDm.FindOne(dtoWanted.uuid, dtoWanted.revision);

            // check
            // 該当の UUID、バージョン の情報が存在しない場合は排他エラー
            if(!target)
                throw new Error(`排他エラー`);
            
            // upsert
            const doneWanted = await wantedDm.UpdateDone(target, dtoWanted.done);
            result.target = doneWanted;

            return result;
        })
        .then(async (result: any) => {
            // await flow.Release();
            return res.send(JSON.stringify({
                success: true,
                wanteds: [result.target]
            }));
        })
        .catch(async (error: any) => {
            // await flow.Release();
            throw new Error(JSON.stringify({
                success: false,
                reason: error
            }));
        });
    }
}