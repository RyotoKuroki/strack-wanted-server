import Flow from '../app.db.flows/Flow';
import TrWanted from '../app.db.entities/TrWanted';
import uuid from 'node-uuid';

export default class WantedsDelete {

    public async Delete(req, res, next) {
        
        const params = req.body;
        const dtoWanted: TrWanted = params.wanteds[0];
        const flow = new Flow();
        flow.Run([TrWanted])
        .then(async (result: any) => {
            if(dtoWanted.uuid === '')
                throw new Error('削除対象データがありません');
            return result;
        })
        .then(async (result: any) => {
            await flow.BeginTransaction();
            return result;
        })
        .then(async (result: any) => {
            const target = await TrWanted.findOne({
                where: {
                    //whois: wanted.whois
                    uuid: dtoWanted.uuid,
                    revision: dtoWanted.revision
                }
            });
            // 該当の UUID、バージョン の情報が存在しない場合は排他エラー
            if(!target)
                throw new Error(`排他エラー`);
            result.target = target;
            return result;
        })
        .then(async (result: any) => {
            const target: TrWanted = result.target;
            target.enabled = 'disable';
            target.revision = ++target.revision;
            await TrWanted.save(target);
            return result;
        })
        .then(async (result: any) => {
            await flow.Commit();
            return result;
        })
        .then(async (result: any) => {
            await flow.Release();
            return res.send(JSON.stringify({
                success: true,
                wanteds: [result.target]
            }));
        })
        .catch(async (error: any) => {
            await flow.Release();
            throw new Error(JSON.stringify({
                success: false,
                reason: error
            }));
        });
    }
}