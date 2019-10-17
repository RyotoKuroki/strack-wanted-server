import Datastore from '../../app.infras/infra.datastores/Infra.Datastore';
import TrWanted from '../../app.entities/TrWanted';
import WantedDomain from '../Wanted.Domain';

export default class WantedsUpsert {

    public async Save(req, res, next) {
        
        const params = req.body;
        const dtoWanted: TrWanted = params.wanteds[0];

        const datastore = new Datastore();
        datastore.RunWithTransaction([TrWanted], async (result: any) => {

            const wantedDm = new WantedDomain(datastore);
            const target = dtoWanted;
            const isModify = target.uuid && target.uuid !== '';
            if(isModify){
                // update
                const patchKeys = wantedDm.CreatePatchSpecifyKeys(dtoWanted.uuid, dtoWanted.revision);
                const values = { 
                    name: dtoWanted.name,
                    prize_money: dtoWanted.prize_money,
                    warning: dtoWanted.warning,
                    image_base64: dtoWanted.image_base64
                };
                const modify = await wantedDm.Update(patchKeys, values);
                result.target = modify;
            } else {
                // insert
                //target.whois = ''; // TODO: ユーザ管理
                //target.image_base64 = dtoWanted.image_base64;
                //target.name = dtoWanted.name;
                //target.prize_money = dtoWanted.prize_money;
                //target.warning = dtoWanted.warning;
                const ins = await wantedDm.Insert({
                    name: dtoWanted.name,
                    prize_money: dtoWanted.prize_money,
                    warning: dtoWanted.warning,
                    image_base64: dtoWanted.image_base64
                });
                result.target = ins;
            }
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
