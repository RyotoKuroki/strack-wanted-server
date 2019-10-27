import { AbsRepositoryFactory } from '../app.domains.repositories/Abs.repository.factory';
import { BingobookFetchRepositoryFactory } from '../app.domains.repositories/bingobook.fetch/bingobook.fetch.repository.factory';
import { BingobookFetchRepository } from '../app.domains.repositories/bingobook.fetch/bingobook.fetch.repository';
import BingobookFetchDomain from '../app.domains/bingobook.fetch.domain';

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
