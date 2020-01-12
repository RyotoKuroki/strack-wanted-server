import { TrWanted } from "../app.entities/tr.wanted";
import DataStore from "../app.infras/datastores/datastore.mysql";

export default class WantedFetchDomain {

    // TODO: エンティティのフィールド定義 meta へ移動
    // 本当は TrWanted.PrototypeNames.uuid -> "uuid" みたいに取得できればいいけど。。。
    // やり方が分からない Orz
    protected FIELD_WHOIS = 'whois';
    protected FIELD_UUID = 'uuid';
    protected FIELD_REVISION = 'revision';
    protected FIELD_ENABLED = 'enabled';

    protected _DataStore: DataStore;
    constructor (dataStore: DataStore) {
        this._DataStore = dataStore;
    }

    public async Fetch (whois: string, enabled: string): Promise<{ wanteds: TrWanted[] }> {

        // ■抽出条件
        const conditions: { [key: string]: any } = {};
        TrWanted.MergeArray2Entity([ whois, enabled, ], conditions, [
            this.FIELD_WHOIS,
            this.FIELD_ENABLED,
        ]);
        const wanteds = await TrWanted.Fetch_ByEntity(conditions);
        return { wanteds: wanteds };
    }

    public async FetchOne (whois: string, uuid: string, revision: number, enabled: string): Promise<{ wanted: TrWanted | undefined }> {
        
        // ■抽出条件
        const conditions: { [key: string]: any } = {};
        TrWanted.MergeArray2Entity([ whois, uuid, revision, enabled, ], conditions, [
            this.FIELD_WHOIS,
            this.FIELD_UUID,
            this.FIELD_REVISION,
            this.FIELD_ENABLED,
        ]);
        const wanteds = await TrWanted.Fetch_ByEntity(conditions);
        return wanteds.length > 0 ? { wanted: wanteds[0] } : { wanted: undefined };
    }
}
