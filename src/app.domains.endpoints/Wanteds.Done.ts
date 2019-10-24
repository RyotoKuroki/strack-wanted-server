import { AbsRepositoryFactory } from '../app.domains.repositories/Abs.Repository.Factory';
import { WantedDoneRepositoryFactory } from '../app.domains.repositories/wanted.done/WantedDoneRepositoryFactory';
import { WantedDoneRepository } from '../app.domains.repositories/wanted.done/Wanted.Done.Repository';
import WantedDoneDomain from '../app.domains/Wanted.Done.Domain';

export default class WantedsDone {

    public async Done(req, res, next) {
        
        const params = req.body;
        const dto = {
            whois: params.whois,
            wanted: params.wanteds[0],
        };
        const factory: AbsRepositoryFactory<WantedDoneRepository> = new WantedDoneRepositoryFactory();
        const wantedDoneRepository = await factory.SetupCompletely();
        wantedDoneRepository.RunWithTran(async (result: any) => {

            const wantedDoneDomain = new WantedDoneDomain(wantedDoneRepository);
            await wantedDoneDomain.Done(dto.whois, dto.wanted);
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
