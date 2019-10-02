// const cors = require('cors')({Origin: true});
import Flow from '../../app.db.flows/Flow';
import TrWanted from '../../app.db.entities/TrWanted';
import uuid from 'node-uuid';

export default class PutWanteds {

    // PUT/wanteds
    public async PutWanteds(req, res, next) {
        
        console.log(`put begin`);

        const params = req.body;
        const dtoWanted: TrWanted = params.wanteds[0];
        const flow = new Flow();
        flow.Run([TrWanted])
        .then(async (result: any) => {
            console.log(`begin tran`);
            await flow.BeginTransaction();
            return result;
        })
        .then(async (result) => {
            console.log(`find one : uuid= ${dtoWanted.uuid}, revision= ${dtoWanted.revision}`);
            if(dtoWanted.uuid === ''){
                result.target = dtoWanted;
                return result;
            }
            
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
            console.log(`upd start`);
            // release connection.
            const target: TrWanted = result.target;
            target.uuid = (!target.uuid || target.uuid === '') ? (`${uuid.v4()}-${Date.now()}`) : target.uuid;
            target.image_base64 = dtoWanted.image_base64;
            target.name = dtoWanted.name;
            target.prize_money = dtoWanted.prize_money;
            target.warning = dtoWanted.warning;
            target.done = dtoWanted.done;
            target.revision = ++target.revision;
            console.log(`save target in put : ${JSON.stringify(target)}`);
            await TrWanted.save(target);
            // await target.save();
            return result;
        })
        .then(async (result: any) => {
            // release connection.
            console.log(`commit`);
            await flow.Commit();
            await flow.Release();
            return result;
        })
        .then((result: any) => {
            // response
            return res.send(JSON.stringify({
                success: true,
                wanteds: [result.target]
            }));
        })
        .catch(error => {
            throw new Error(JSON.stringify({
                success: false
            }));
        });
    }
}