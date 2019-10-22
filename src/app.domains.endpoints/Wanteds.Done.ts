import { AbsRepositoryFactory } from '../app.domains.repositories/Abs.Repository.Factory';
import { WantedDoneRepositoryFactory } from '../app.domains.repositories/wanted.done/WantedDoneRepositoryFactory';
import { WantedDoneRepository } from '../app.domains.repositories/wanted.done/Wanted.Done.Repository';
import WantedDoneDomain from '../app.domains/wanted.done/Wanted.Done.Domain';
import { TrWanted } from '../app.entities/TrWanted';

export default class WantedsUpsert {

    public async Save(req, res, next) {
        
        const params = req.body;
        const dto = {
            whois: params.whois,
            wanted: params.wanteds[0],
        };
        const factory: AbsRepositoryFactory<WantedDoneRepository> = new WantedDoneRepositoryFactory();
        const wantedDoneRepository = await factory.SetupCompletely();
        wantedDoneRepository.RunWithTran(async (result: any) => {

            const params = req.body;
            const whois: string = params.whois;
            const wanted: TrWanted = params.wanteds[0];
            const wantedDoneDomain = new WantedDoneDomain(wantedDoneRepository);
            await wantedDoneDomain.Done(whois, wanted);

            result.target = wantedDoneRepository.StoredWanted;

            
            /*
            console.log(`specifykeys`);
            // クライアントから受信した、Wanted 情報を特定するためのキーを使用し、DBレコード抽出
            const specifyKeys = new PatchSpecifyKeys(dtoWanted.uuid, dtoWanted.revision);
            console.log(`fetch`);
            // 更新対象の Wanted 情報を抽出
            await wantedDoneRepository.FetchWanted(specifyKeys);
            console.log(`update done`);
            // 対象 Wanted の Done フィールドを更新
            await wantedDoneRepository.UpdateDone(dtoWanted.done === WantedDomain.DONE_STATUS__DONE);
            console.log(`result`);
            // 結果情報取得
            result.target = wantedDoneRepository.Wanted;
            */
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

            // 更新。
            const patchKeys = wantedDm.CreatePatchSpecifyKeys(dtoWanted.uuid, dtoWanted.revision);
            const done = await wantedDm.UpdateDone(patchKeys, dtoWanted.done === WantedDomain.DONE_STATUS__DONE);

            result.target = done;
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