import DataStore from '../app.infras/infra.datastores/DataStore';
import { TrWanted } from '../app.entities/TrWanted';
import WantedDomain from '../app.domains/Wanted.Domain';

export default class WantedsUpsert {

    public async Save(req, res, next) {
        
        const params = req.body;
        const whois: TrWanted = params.whois;
        const dtoWanted: TrWanted = params.wanteds[0];

        const datastore = new DataStore();
        await datastore.Init([TrWanted]);
        datastore.RunWithTransaction(async (result: any) => {

            const wantedDm = new WantedDomain(datastore);
            const target = dtoWanted;
            const isModify = target.uuid && target.uuid !== '';
            const values = { 
                name: dtoWanted.name,
                prize_money: dtoWanted.prize_money,
                warning: dtoWanted.warning,
                image_base64: dtoWanted.image_base64
            };
            if(isModify){
                // update
                const patchKeys = wantedDm.CreatePatchSpecifyKeys(dtoWanted.uuid, dtoWanted.revision);
                const modify = await wantedDm.Update(patchKeys, values);
                result.target = modify;
            } else {
                // insert
                const ins = await wantedDm.Insert(values);
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
