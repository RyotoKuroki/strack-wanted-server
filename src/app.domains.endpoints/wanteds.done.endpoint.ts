import { AbsRepositoryFactory } from '../app.domains.repositories/Abs.repository.factory';
import { WantedDoneRepositoryFactory } from '../app.domains.repositories/wanted.done/wanted.done.repository.factory';
import { WantedDoneRepository } from '../app.domains.repositories/wanted.done/wanted.done.repository';
import WantedDoneDomain from '../app.domains/wanted.done.domain';
import ITR_Wanted from 'strack-wanted-meta/dist/entities/I.tr.wanted';

export default class WantedsDone {

    public async Done(req, res, next) {
        
        const params = req.body;
        const dto: {
            whois: string,
            wanted: ITR_Wanted
        } = {
            whois: params.whois,
            wanted: params.wanteds[0],
        };
        const factory: AbsRepositoryFactory<WantedDoneRepository> = new WantedDoneRepositoryFactory();
        const wantedDoneRepository = await factory.SetupCompletely();
        wantedDoneRepository.RunWithTran(async (result: any) => {

            const wantedDoneDomain = new WantedDoneDomain(wantedDoneRepository);
            await wantedDoneDomain.Done(dto.whois, dto.wanted.uuid, dto.wanted.revision, dto.wanted.done);
            result.target = wantedDoneRepository.StoredWanted;
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
