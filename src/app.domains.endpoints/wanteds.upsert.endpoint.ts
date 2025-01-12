import Endpoint, { UseDataStore } from './Endpoint';
import WantedUpsertDomain from '../app.domains/wanted.upsert.domain';
import { TrWanted } from '../app.entities/tr.wanted';
import AppDomain from '../app.domains/app.domain';
import AccessorConfig from '../app.infras/datastores/datastore.mysql.accessors/accessor.mysql.config';

//@UseDataStore
export default class WantedsUpsertEndpoint extends Endpoint {

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

        console.log("Create wanted(1)");

        const appDomain = new AppDomain();
        const result = await appDomain.RunWithTran(
            AccessorConfig.GetConfig([TrWanted]),
            async (entityManager) => {

                console.log("Create wanted(2)");
                const domain = new WantedUpsertDomain(entityManager);

                console.log("Create wanted(3)");
                const isNew = domain.IsNew(params.wanted);

                console.log("Create wanted(4)");
                
                const specifyKeys = isNew
                    ? await domain.Insert(params.wanted)
                    : await domain.Update(params.wanted);
                const resultEntity = await domain.Fetch(
                                                    specifyKeys.whois,
                                                    specifyKeys.uuid,
                                                    specifyKeys.revision);
                console.log("Create wanted(5)");
                return resultEntity;
            });

        console.log("Create wanted(6)");
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
