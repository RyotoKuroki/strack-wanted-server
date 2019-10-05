// const cors = require('cors')({Origin: true});
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
            await flow.BeginTransaction();
            return result;
        })
        .then(async (result) => {
            // console.log(`find one : uuid= ${dtoWanted.uuid}, revision= ${dtoWanted.revision}`);
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
            result.target = modify;
            return result;
        })
        .then(async (result: any) => {
            const target: TrWanted = result.target;
            target.done = 'done';
            target.revision = ++target.revision;
            const pathced = await TrWanted.save(target);
            console.log(`patched : ${JSON.stringify(pathced)}`);
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
        .catch(async (error) => {
            console.log(`error catch : ${JSON.stringify(error)}`);
            await flow.Release();
            throw new Error(JSON.stringify({
                success: false,
                reason: error
            }));
        });
    }
}