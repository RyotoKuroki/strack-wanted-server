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

            // TrWanted型オブジェクトか、無し のいずれか
            let target: TrWanted | undefined = dtoWanted;
            if(dtoWanted.uuid !== ''){
                // 既存データの更新の場合、ID、バージョン でDB検索
                const modify = await TrWanted.findOne({
                    where: {
                        //whois: wanted.whois
                        uuid: dtoWanted.uuid,
                        revision: dtoWanted.revision
                    }
                });
                target = modify;
            }
            // 該当の UUID、バージョン の情報が存在しない場合は排他エラー
            if(!target)
                throw new Error(`排他エラー`);
            
            target.uuid = (!target.uuid || target.uuid === '') ? (`${uuid.v4()}-${Date.now()}`) : target.uuid;
            target.image_base64 = dtoWanted.image_base64;
            target.name = dtoWanted.name;
            target.prize_money = dtoWanted.prize_money;
            target.warning = dtoWanted.warning;
            target.done = dtoWanted.done;
            target.revision = ++target.revision;
            await TrWanted.save(target);
            // await flow.Commit();
            
            result.target = target;
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