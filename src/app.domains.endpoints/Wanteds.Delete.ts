import { AbsRepositoryFactory } from '../app.domains.repositories/Abs.Repository.Factory';
import { WantedDeleteRepositoryFactory } from '../app.domains.repositories/wanted.delete/WantedDeleteRepositoryFactory';
import { WantedDeleteRepository } from '../app.domains.repositories/wanted.delete/Wanted.Delete.Repository';
import WantedDeleteDomain from '../app.domains/Wanted.Delete.Domain';
import { TrWanted } from '../app.entities/TrWanted';

export default class WantedsDelete {

    public async Delete(req, res, next) {
        
        const params = req.body;
        const dto = {
            whois: params.whois,
            wanted: params.wanteds[0],
        };
        const factory: AbsRepositoryFactory<WantedDeleteRepository> = new WantedDeleteRepositoryFactory();
        const wantedDeleteRepository = await factory.SetupCompletely();
        wantedDeleteRepository.RunWithTran(async (result: any) => {

            const wantedDeleteDomain = new WantedDeleteDomain(wantedDeleteRepository);
            await wantedDeleteDomain.Remove(dto.whois, dto.wanted);
            result.target = wantedDeleteRepository.StoredWanted;
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
