import { AbsRepositoryFactory } from '../app.domains.repositories/Abs.Repository.Factory';
import { BingobookFetchRepositoryFactory } from '../app.domains.repositories/bingobook.fetch/BingobookFetchRepositoryFactory';
import { BingobookFetchRepository } from '../app.domains.repositories/bingobook.fetch/Bingobook.Fetch.Repository';
import BingobookFetchDomain from '../app.domains/Bingobook.Fetch.Domain';

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
    }
}
