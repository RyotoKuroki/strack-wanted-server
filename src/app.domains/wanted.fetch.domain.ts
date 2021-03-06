import { TrWanted } from "../app.entities/tr.wanted";
import DataStore from "../app.infras/datastores/datastore";
import { KvpMap } from "../app.utils/KvpMap";

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
        const condition = new KvpMap()
        .Add2Map(this.FIELD_WHOIS, whois)
        .Add2Map(this.FIELD_ENABLED, enabled)
        .Map;
        const wanteds = await TrWanted.InTran_Fetch(this._DataStore, condition);
        return { wanteds: wanteds };
    }

    public async FetchOne (whois: string, uuid: string, revision: number, enabled: string): Promise<{ wanted: TrWanted | undefined }> {
        
        // ■抽出条件
        const map = new KvpMap()
        .Add2Map(this.FIELD_WHOIS, whois)
        .Add2Map(this.FIELD_UUID, uuid)
        .Add2Map(this.FIELD_REVISION, revision)
        .Add2Map(this.FIELD_ENABLED, enabled)
        .Map;
        const wanteds = await TrWanted.InTran_Fetch(this._DataStore, map);
        return wanteds.length > 0 ? { wanted: wanteds[0] } : { wanted: undefined };
    }
}
