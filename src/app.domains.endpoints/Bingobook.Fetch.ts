import { AbsRepositoryFactory } from '../app.domains.repositories/Abs.Repository.Factory';
import { BingobookFetchRepositoryFactory } from '../app.domains.repositories/bingobook.fetch/BingobookFetchRepositoryFactory';
import { BingobookFetchRepository } from '../app.domains.repositories/bingobook.fetch/Bingobook.Fetch.Repository';
import BingobookFetchDomain from '../app.domains/bingobook.fetch/Bingobook.Fetch.Domain';

export default class WantedsGet {

    public async Fetch(req, res, next) {

        const params = req.body;
        const dto = {
            whois: params.whois,
        };
        const factory: AbsRepositoryFactory<BingobookFetchRepository> = new BingobookFetchRepositoryFactory();
        const bingobookFetchRepository = await factory.SetupCompletely();
        bingobookFetchRepository.RunWithTran(async (result: any) => {

            const wantedDoneDomain = new BingobookFetchDomain(bingobookFetchRepository);
            await wantedDoneDomain.StoreWanteds(dto);

            result.targets = bingobookFetchRepository.StoredWanteds;

            
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
                wanteds: result.targets
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
        datastore.Run(async (result: any) => {

            const wantedDm = new WantedDomain(datastore);
            const wanteds = await wantedDm.FindMatches(WantedDomain.ENABLED_STATUS__ENABLED);

            result.wanteds = wanteds;
            return result;
        })
        .then(async (result: any) => {
            return res.send(JSON.stringify({
                success: true,
                wanteds: result.wanteds
            }));
        })
        .catch(async (error: any) => {
            throw new Error(JSON.stringify({
                success: false
            }));
        });
        */
    }
}