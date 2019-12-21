import { AbsRepositoryFactory } from '../app.domains.repositories/Abs.repository.factory';
import { WantedDeleteRepositoryFactory } from '../app.domains.repositories/wanted.delete/wanted.delete.repository.factory';
import { WantedDeleteRepository } from '../app.domains.repositories/wanted.delete/wanted.delete.repository';
import WantedDeleteDomain from '../app.domains/wanted.delete.domain';
import ITR_Wanted from 'strack-wanted-meta/dist/entities/I.tr.wanted';

export default class WantedsDelete {

    public async Remove(req, res, next) {
        
        const params = req.body;
        const dto: {
            whois: string,
            wanted: ITR_Wanted
        } = {
            whois: params.whois,
            wanted: params.wanteds[0],
        };
        const factory: AbsRepositoryFactory<WantedDeleteRepository> = new WantedDeleteRepositoryFactory();
        const wantedDeleteRepository = await factory.SetupCompletely();
        wantedDeleteRepository.RunWithTran(async (result: any) => {

            const wantedDeleteDomain = new WantedDeleteDomain(wantedDeleteRepository);
            await wantedDeleteDomain.Remove(dto.whois, dto.wanted.uuid, dto.wanted.revision);
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
            return res.send(JSON.stringify({
                success: false,
                error: error
            }));
        });
    }
}
