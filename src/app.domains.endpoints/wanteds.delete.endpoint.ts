import Endpoint, { UseDataStore } from './Endpoint';
import WantedDeleteDomain from '../app.domains/wanted.delete.domain';
import { TrWanted } from '../app.entities/tr.wanted';
import AppDomain from '../app.domains/app.domain';
import AccessorConfig from '../app.infras/datastores/datastore.mysql.accessors/accessor.mysql.config';

//@UseDataStore
export default class WantedsDeleteEndpoint extends Endpoint {

    /** コンストラクタ */
    constructor (req: any, res: any) {
        super(req, res);
    }

    /** リクエストパラメータを抽出 */
    /* override */ 
    GetParams (
        dto: any
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

                console.log("Delete wanted(1)");
                const domain = new WantedDeleteDomain(entityManager);

                console.log("Delete wanted(2)");
                const resultUpsert = await domain.Remove(params.wanted);

                console.log("Delete wanted(3)");
                const resultEntity = await domain.Fetch(
                                                    resultUpsert.whois,
                                                    resultUpsert.uuid,
                                                    resultUpsert.revision,
                                                    resultUpsert.enabled);
                console.log("Delete wanted(4)");
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
        this._Response.send(JSON.stringify({
            success: false,
            error: error.message
        }));
    }
}
