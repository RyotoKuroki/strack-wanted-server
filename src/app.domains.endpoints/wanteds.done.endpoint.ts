import Endpoint, { UseDataStore } from './Endpoint';
import WantedDoneDomain from '../app.domains/wanted.done.domain';
import { TrWanted } from '../app.entities/tr.wanted';
import AppDomain from '../app.domains/app.domain';
import AccessorConfig from '../app.infras/datastores/datastore.mysql.accessors/accessor.mysql.config';

//@UseDataStore
export default class WantedsDoneEndpoint extends Endpoint {

    /** コンストラクタ */
    constructor (req: any, res: any) {
        super(req, res);
    }

    /** リクエストパラメータを抽出 */
    /* override */ 
    GetParams (
        dto: {
            whois: string,
            wanted: TrWanted
        }
    ): {
        whois: string,
        wanted: TrWanted
    } {
    
        return {
            whois: dto.whois,
            wanted: dto.wanted
        };
    }

    /** メイン処理 */
    /* override */ 
    //@InitDataStore(/*[TrWanted]*/)
    async MainMethod (
        //dataStore: DataStore,
        params: {
            whois: string,
            wanted: TrWanted
        }
    ): Promise<{
        wanted: TrWanted
    }> {

        const appDomain = new AppDomain();
        const result = await appDomain.RunWithTran(
            AccessorConfig.GetConfig([TrWanted]),
            async (entityManager) => {

                console.log("Done wanted(1)");
                const domain = new WantedDoneDomain(entityManager);

                console.log("Done wanted(2)");
                const resultUpsert = await domain.Done(params.wanted);

                console.log("Done wanted(3)");
                const resultEntity = await domain.Fetch(
                                                    resultUpsert.whois,
                                                    resultUpsert.uuid,
                                                    resultUpsert.revision);

                console.log("Done wanted(4)");
                return resultEntity;
            });

       return result;
    }

    /** 正常終了時処理 */
    /* override */ 
    async OnSuccess (result: any) {
        this._Response.send(JSON.stringify({
            success: true,
            wanted: result.wanted
        }));
    }

    /** 異常終了時処理 */
    /* override */ 
    async OnFail (error: any) {
        console.log(`on-fail : ${JSON.stringify(error)}`);
        this._Response.send(JSON.stringify({
            success: false,
            error: error.message
        }));
    }
}
