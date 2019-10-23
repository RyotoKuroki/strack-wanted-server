import { AbsRepositoryFactory } from '../app.domains.repositories/Abs.Repository.Factory';
import { WantedUpsertRepositoryFactory } from '../app.domains.repositories/wanted.upsert/WantedUpsertRepositoryFactory';
import { WantedUpsertRepository } from '../app.domains.repositories/wanted.upsert/Wanted.Upsert.Repository';
import WantedUpsertDomain from '../app.domains/Wanted.Upsert.Domain';
import { TrWanted } from '../app.entities/TrWanted';

export default class WantedsUpsert {

    public async Save(req, res, next) {
        
        const params = req.body;
        const dto = {
            whois: params.whois,
            wanted: params.wanteds[0],
        };
        const factory: AbsRepositoryFactory<WantedUpsertRepository> = new WantedUpsertRepositoryFactory();
        const wantedUpsertRepository = await factory.SetupCompletely();
        wantedUpsertRepository.RunWithTran(async (result: any) => {

            const wantedUpsertDomain = new WantedUpsertDomain(wantedUpsertRepository);
            await wantedUpsertDomain.Upsert(dto.whois, dto.wanted);
            result.target = wantedUpsertRepository.StoredWanted;
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




/*
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
        */
    }
}
