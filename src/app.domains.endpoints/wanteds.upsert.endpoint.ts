import Endpoint, { UseDataStore } from './Endpoint';
import WantedUpsertDomain from '../app.domains/wanted.upsert.domain';
import DataStore from '../app.infras/datastores/datastore.mysql';
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
    @InitDataStore([TrWanted])
    async MainMethod (dataStore: DataStore, params: { whois: string, wanted: TrWanted }): Promise<{ wanteds: TrWanted[] }> {

        params.wanted.whois = params.whois;
        const domain = new WantedUpsertDomain(dataStore);
        const result = await dataStore.RunWithTransaction(async (result: { wanteds: TrWanted[] }) => {

            const isNew = domain.IsNew(params.wanted);

            let upd: { wanted: TrWanted };
            if (isNew) {
                const ins = await domain.Insert(params.wanted);
                // 新規登録の場合、ドメイン内の Insert 処理で uuid 等が新規で生成される。
                // 生成された値は、Fetch 時のパラメータとして使用。
                // リビジョンは初期値：0（ドメイン内で +1）。
                upd = await domain.Fetch(ins.wanted.whois, ins.wanted.uuid, 0);
            } else {
                await domain.Upsert(params.wanted);
                upd = await domain.Fetch(params.wanted.whois, params.wanted.uuid, params.wanted.revision);
            }
            result.wanteds = [upd.wanted]; // 詰め替えなくてもいいけど、お作法でやってるだけｗ
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
            error: 'エラーが発生しました。'
        }));
    }
}
