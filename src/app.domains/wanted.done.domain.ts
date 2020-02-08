import { TrWanted } from '../app.entities/tr.wanted';
import DataStore from "../app.infras/datastores/datastore";
import { KvpMap } from '../app.utils/KvpMap';

export default class WantedDoneDomain {

    // TODO: エンティティのフィールド定義 meta へ移動
    // 本当は TrWanted.PrototypeNames.uuid -> "uuid" みたいに取得できればいいけど。。。
    // やり方が分からない Orz
    protected FIELD_WHOIS = 'whois';
    protected FIELD_UUID = 'uuid';
    protected FIELD_REVISION = 'revision';
    protected FIELD_ENABLED = 'enabled';
    protected FIELD_DONE = 'done';

    protected _DataStore: DataStore;
    constructor (dataStore: DataStore) {
        this._DataStore = dataStore;
    }

    public async Done (wanted: TrWanted): Promise<{ whois: string, uuid: string, revision: number }> {

        const rev = Number(wanted.revision);

        // ■更新時の抽出条件
        const condition = new KvpMap()
        .Add2Map(this.FIELD_WHOIS, wanted.whois)
        .Add2Map(this.FIELD_UUID, wanted.uuid)
        .Add2Map(this.FIELD_REVISION, rev)
        .Map;
        // ■更新（更新）時の設定値
        const value = new KvpMap()
        .Add2Map(this.FIELD_REVISION, TrWanted.GetNextRev(rev))
        .Add2Map(this.FIELD_DONE, wanted.done)
        .Map;
        const affectedRows = await TrWanted.InTran_Update(this._DataStore, value, condition);
        this._DataStore.ThrowErrorNotExpectedAffectedRowsCount(affectedRows, 1);

        return {
            whois: wanted.whois,
            uuid: wanted.uuid,
            revision: value.revision, // next-value
        };
    }

    public async Fetch (whois: string, uuid: string, revision: number): Promise<{ wanted: TrWanted }> {

        // ▽更新後のデータ再取得
        const map = new KvpMap()
        .Add2Map(this.FIELD_WHOIS, whois)
        .Add2Map(this.FIELD_UUID, uuid)
        .Add2Map(this.FIELD_REVISION, Number(revision))
        .Map;
        const wanteds = await TrWanted.InTran_Fetch(this._DataStore, map);
        return { wanted: wanteds[0] };
    }
}
