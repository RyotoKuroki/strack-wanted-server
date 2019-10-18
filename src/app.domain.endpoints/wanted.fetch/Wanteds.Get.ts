import DataStore from '../../app.infras/infra.datastores/DataStore';
import TrWanted from '../../app.entities/TrWanted';
import WantedDomain from '../Wanted.Domain';

export default class WantedsGet {

    public async Get(req, res, next) {

        const datastore = new DataStore();
        datastore.Run([TrWanted], async (result: any) => {

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
    }
}