import { AbsRepositoryFactory } from '../app.domains.repositories/Abs.Repository.Factory';
import { WantedUpsertRepositoryFactory } from '../app.domains.repositories/wanted.upsert/WantedUpsertRepositoryFactory';
import { WantedUpsertRepository } from '../app.domains.repositories/wanted.upsert/Wanted.Upsert.Repository';
import WantedUpsertDomain from '../app.domains/Wanted.Upsert.Domain';

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
    }
}
