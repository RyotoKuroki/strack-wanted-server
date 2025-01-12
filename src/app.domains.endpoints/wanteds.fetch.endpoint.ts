import Endpoint, { UseDataStore } from './Endpoint';
import WantedFetchDomain from '../app.domains/wanted.fetch.domain';
import { TrWanted } from '../app.entities/tr.wanted';
import { EntityEnableStates } from 'strack-wanted-meta/dist/consts/states/states.entity.enabled';
import AppDomain from '../app.domains/app.domain';
import AccessorConfig from '../app.infras/datastores/datastore.mysql.accessors/accessor.mysql.config';

//@UseDataStore
export default class WantedsFetchEndpoint extends Endpoint {

    /** コンストラクタ */
    constructor (req: any, res: any) {
        super(req, res);
    }

    /** リクエストパラメータを抽出 */
    /* override */ 
    GetParams (dto: any): any {
        return {
            whois: dto.whois
        };
    }

    /** メイン処理 */
    /* override */ 
//    @InitDataStore(/*[TrWanted]*/)
    async MainMethod (
        //dataStore: DataStore,
        params: {
            whois: string
        }
    ): Promise<{
        wanteds: TrWanted[]
    }> {

        const appDomain = new AppDomain();
        const result = await appDomain.Run2(
            AccessorConfig.GetConfig([TrWanted]),
            async (entityManager) => {

                const domain = new WantedFetchDomain(entityManager);
                const resultEntities = await domain.Fetch(params.whois, EntityEnableStates.ENABLE);
                return resultEntities;
            });

        return result;
    }

    /** 正常終了時処理 */
    /* override */ 
    async OnSuccess (result: any) {
        this._Response.send(JSON.stringify({
            success: true,
            wanteds: result.wanteds
        }));
    }

    /** 異常終了時処理 */
    /* override */ 
    async OnFail (error: any) {
        console.log(`on-fail : ${JSON.stringify(error)}`);
        this._Response.send(JSON.stringify({
            success: false,
            error: error
        }));
    }
}
