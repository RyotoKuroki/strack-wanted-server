import { TrWanted } from '../app.entities/tr.wanted';
import DataStore from "../app.infras/datastores/datastore.mysql";

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

    public async Done (wanted: TrWanted): Promise<void> {

        const rev = Number(wanted.revision);
        // ■更新時の抽出条件
        const conditions: { [key: string]: any } = {};
        TrWanted.MergeArray2Entity([
            wanted.whois,
            wanted.uuid,
            rev
        ], conditions, [
            this.FIELD_WHOIS,
            this.FIELD_UUID,
            this.FIELD_REVISION,
        ]);
        // ■更新（更新）時の設定値
        const values: { [key: string]: any } = {};
        TrWanted.MergeArray2Entity([
            rev + 1,
            wanted.done
        ], values, [
            this.FIELD_REVISION,
            this.FIELD_DONE
        ]);
        const affectedRows = await this._DataStore.Update(TrWanted, values, conditions);
        this._DataStore.ThrowErrorNotExpectedAffectedRowsCount(affectedRows, 1);
    }

    public async Fetch (wanted: TrWanted): Promise<{ wanted: TrWanted }> {

        const rev = Number(wanted.revision);
        // ▽更新後のデータ再取得
        const conditions: { [key: string]: any } = {};
        TrWanted.MergeArray2Entity([
            wanted.whois,
            wanted.uuid,
            rev + 1,
        ], conditions, [
            this.FIELD_WHOIS,
            this.FIELD_UUID,
            this.FIELD_REVISION,
        ]);
        const wanteds = await this._DataStore.Fetch({
            schema: TrWanted,
            schemaAlias: 'TrWanted',
            where: conditions
        });
        return { wanted: wanteds[0] };
    }
}
