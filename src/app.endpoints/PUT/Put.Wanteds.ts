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
            await flow.BeginTransaction();
            return result;
        })
        .then(async (result) => {
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
            // release connection.
            const target: TrWanted = result.target;
            target.uuid = (!target.uuid || target.uuid === '') ? (`${uuid.v4()}-${Date.now()}`) : target.uuid;
            target.image_base64 = dtoWanted.image_base64;
            target.name = dtoWanted.name;
            target.prize_money = dtoWanted.prize_money;
            target.warning = dtoWanted.warning;
            target.revision = ++target.revision;
            await TrWanted.save(target);
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