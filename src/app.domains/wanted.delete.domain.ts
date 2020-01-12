import { TrWanted } from '../app.entities/tr.wanted';
import DataStore from "../app.infras/datastores/datastore.mysql";
import { EntityEnableStates } from 'strack-wanted-meta/dist/consts/states/states.entity.enabled';
import EntityMerge from '../app.infras/datastores/datastore.libs/datastore.entity.merge';

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

    public async Remove (wanted: TrWanted): Promise<void> {

        const rev = Number(wanted.revision);
        // ■削除時の抽出条件
        const conditions: { [key: string]: any } = {};
        EntityMerge.Array2Entity([
            wanted.whois,
            wanted.uuid,
            rev,
        ], conditions, [
            this.FIELD_WHOIS,
            this.FIELD_UUID,
            this.FIELD_REVISION,
        ]);
        // ■削除（更新）時の設定値
        const values: { [key: string]: any } = {};
        EntityMerge.Array2Entity([
            rev + 1,
            EntityEnableStates.DISABLE,
        ], values, [
            this.FIELD_REVISION,
            this.FIELD_ENABLED,
        ]);
        const affectedRows = await this._DataStore.Update(TrWanted, values, conditions);
        this._DataStore.ThrowErrorNotExpectedAffectedRowsCount(affectedRows, 1);

    }
    
    public async Fetch (wanted: TrWanted): Promise<{ wanted: TrWanted }> {

        const rev = Number(wanted.revision);
        // ▽更新後のデータ再取得
        const conditions: { [key: string]: any } = {};
        EntityMerge.Array2Entity([
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
