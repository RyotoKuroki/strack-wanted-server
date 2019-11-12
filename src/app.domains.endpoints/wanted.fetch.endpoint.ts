import { AbsRepositoryFactory } from '../app.domains.repositories/Abs.repository.factory';
import { WantedFetchRepositoryFactory } from '../app.domains.repositories/wanted.fetch/wanted.fetch.repository.factory';
import { WantedFetchRepository } from '../app.domains.repositories/wanted.fetch/wanted.fetch.repository';
import WantedFetchDomain from '../app.domains/wanted.fetch.domain';

export default class WantedsGet {

    public async Fetch(req, res, next) {

        const params = req.body;
        const dto = {
            whois: params.whois,
        };
        const factory: AbsRepositoryFactory<WantedFetchRepository> = new WantedFetchRepositoryFactory();
        const wantedFetchRepository = await factory.SetupCompletely();
        wantedFetchRepository.RunWithTran(async (result: any) => {

            const wantedDomain = new WantedFetchDomain(wantedFetchRepository);
            await wantedDomain.StoreWanteds(dto);
            result.targets = wantedFetchRepository.StoredWanteds;
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
