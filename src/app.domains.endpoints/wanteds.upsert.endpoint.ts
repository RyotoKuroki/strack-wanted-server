import Endpoint, { UseDataStore } from './Endpoint';
import WantedUpsertDomain from '../app.domains/wanted.upsert.domain';
import DataStore from '../app.infras/datastores/datastore';
import { InitDataStore } from '../app.infras/datastores/datastore.decorators/datastore.decorators';
import { TrWanted } from '../app.entities/tr.wanted';

@UseDataStore
export default class WantedsUpsertEndpoint extends Endpoint {

    /** コンストラクタ */
    constructor (req: any, res: any) {
        super(req, res);
    }

    /** リクエストパラメータを抽出 */
    /* override */ 
    GetParams (dto: any): { whois: string, wanted: TrWanted } {
        return {
            whois: dto.whois,
            wanted: dto.wanteds[0]
        };
    }

    /** メイン処理 */
    /* override */ 
    @InitDataStore(/*[TrWanted]*/)
    async MainMethod (dataStore: DataStore, params: { whois: string, wanted: TrWanted }): Promise<{ wanteds: TrWanted[] }> {

        params.wanted.whois = params.whois;
        const domain = new WantedUpsertDomain(dataStore);
        const result = await dataStore.RunWithTransaction(async (result: { wanteds: TrWanted[] }) => {

            const isNew = domain.IsNew(params.wanted);

            const specifyKeys = isNew
                ? await domain.Insert(params.wanted)
                : await domain.Upsert(params.wanted);
            const domResult = await domain.Fetch(specifyKeys.whois, specifyKeys.uuid, specifyKeys.revision);

            result.wanteds = [domResult.wanted]; // 詰め替えなくてもいいけど、お作法でやってるだけｗ
            return result;
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
        this._Response.send(JSON.stringify({
            success: false,
            error: error.message
        }));
    }
}
