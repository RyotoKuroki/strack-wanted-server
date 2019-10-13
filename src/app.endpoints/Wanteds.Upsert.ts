import Flow from '../app.db.flows/Flow';
import TrWanted from '../app.db.entities/TrWanted';
import uuid from 'node-uuid';

export default class WantedsUpsert {

    public async Save(req, res, next) {
        
        const params = req.body;
        const dtoWanted: TrWanted = params.wanteds[0];

        const flow = new Flow();
        flow.Run([TrWanted])
        .then(async (result: any) => {
            // await flow.BeginTransaction();

            if(dtoWanted.uuid === ''){
                // for add new-row
                result.target = dtoWanted;
                return result;
            }
            // for modify
            const modify = await TrWanted.findOne({
                where: {
                    //whois: wanted.whois
                    uuid: dtoWanted.uuid,
                    revision: dtoWanted.revision
                }
            });
            // 該当の UUID、バージョン の情報が存在しない場合は排他エラー
            if(!modify)
                throw new Error(`排他エラー`);
            
            const target: TrWanted = result.target;
            target.uuid = (!target.uuid || target.uuid === '') ? (`${uuid.v4()}-${Date.now()}`) : target.uuid;
            target.image_base64 = dtoWanted.image_base64;
            target.name = dtoWanted.name;
            target.prize_money = dtoWanted.prize_money;
            target.warning = dtoWanted.warning;
            target.done = dtoWanted.done;
            target.revision = ++target.revision;
            await TrWanted.save(target);
            // await flow.Commit();
            
            result.target = modify;
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