import { AbsRepositoryFactory } from '../app.domains.repositories/Abs.repository.factory';
import { WantedUpsertRepositoryFactory } from '../app.domains.repositories/wanted.upsert/wanted.upsert.repository.factory';
import { WantedUpsertRepository } from '../app.domains.repositories/wanted.upsert/wanted.upsert.repository';
import WantedUpsertDomain from '../app.domains/wanted.upsert.domain';
import ITR_Wanted from 'strack-wanted-meta/dist/entities/I.tr.wanted';

export default class WantedsUpsert {

    public async Save(req, res, next) {
        
        const params = req.body;
        const dto: {
            whois: string,
            wanted: ITR_Wanted
        } = {
            whois: params.whois,
            wanted: params.wanteds[0],
        };
        const factory: AbsRepositoryFactory<WantedUpsertRepository> = new WantedUpsertRepositoryFactory();
        const wantedUpsertRepository = await factory.SetupCompletely();
        wantedUpsertRepository.RunWithTran(async (result: any) => {

            dto.wanted.whois = dto.whois;
            const wantedUpsertDomain = new WantedUpsertDomain(wantedUpsertRepository);
            await wantedUpsertDomain.Upsert(dto.wanted);
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
