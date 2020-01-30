import { TrWanted } from '../app.entities/tr.wanted';
import DataStore from "../app.infras/datastores/datastore.mysql";
import { EntityEnableStates } from 'strack-wanted-meta/dist/consts/states/states.entity.enabled';
import { KvpMap } from '../app.utils/KvpMap';

export default class WantedDeleteDomain {

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

    public async Remove (wanted: TrWanted): Promise<{ whois: string, uuid: string, revision: number }> {

        const rev = Number(wanted.revision);

        // ■削除時の抽出条件
        const condition = new KvpMap()
        .Add2Map(this.FIELD_WHOIS, wanted.whois)
        .Add2Map(this.FIELD_UUID, wanted.uuid)
        .Add2Map(this.FIELD_REVISION, rev)
        .Map;
        // ■削除（更新）時の設定値
        const value = new KvpMap()
        .Add2Map(this.FIELD_REVISION, TrWanted.GetNextRev(rev))
        .Add2Map(this.FIELD_ENABLED, EntityEnableStates.DISABLE)
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

        const map = new KvpMap()
        .Add2Map(this.FIELD_WHOIS, whois)
        .Add2Map(this.FIELD_UUID, uuid)
        .Add2Map(this.FIELD_REVISION, Number(revision))
        .Map;

        const wanteds = await TrWanted.InTran_Fetch(this._DataStore, map);
        return { wanted: wanteds[0] };
    }
}
