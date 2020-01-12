import DataStore from "../app.infras/datastores/datastore.mysql";
import { TrWanted } from '../app.entities/tr.wanted';
import { EntityEnableStates } from 'strack-wanted-meta/dist/consts/states/states.entity.enabled';
import { v4 as uuidv } from 'uuid';
import EntityMerge from "../app.infras/datastores/datastore.libs/datastore.entity.merge";

export default class WantedUpsertDomain {

    // TODO: エンティティのフィールド定義 meta へ移動
    // 本当は TrWanted.PrototypeNames.uuid -> "uuid" みたいに取得できればいいけど。。。
    // やり方が分からない Orz
    protected FIELD_UUID = 'uuid';
    protected FIELD_WHOIS = 'whois';
    protected FIELD_ENABLED = 'enabled';
    protected FIELD_REVISION = 'revision';
    protected FIELD_NAME = 'name';
    protected FIELD_PRIZE = 'prize_money';
    protected FIELD_IMAGE_BASE64 = 'image_base64';
    protected FIELD_WARNING = 'warning';
    protected FIELD_DONE = 'done';

    protected _DataStore: DataStore;
    constructor (dataStore: DataStore) {
        this._DataStore = dataStore;
    }

    public IsNew (wanted: TrWanted) {
        return wanted.uuid === undefined || wanted.uuid === '';
    }

    public async Insert (wanted: TrWanted): Promise<{ wanted: TrWanted }> {

        const rev = Number(wanted.revision);
        // ■更新（作成）時の設定値
        const values: { [key: string]: any } = {};
        const src = [
            uuidv(),
            wanted.whois,
            EntityEnableStates.ENABLE,
            1,
            wanted.name,
            wanted.prize_money,
            wanted.image_base64,
            wanted.warning,
            wanted.done,
        ];
        const fields = [
            this.FIELD_UUID,
            this.FIELD_WHOIS,
            this.FIELD_ENABLED,
            this.FIELD_REVISION,
            this.FIELD_NAME,
            this.FIELD_PRIZE,
            this.FIELD_IMAGE_BASE64,
            this.FIELD_WARNING,
            this.FIELD_DONE,
        ];
        EntityMerge.Array2Entity(src, values, fields);
        const affectedRows = await this._DataStore.Insert(TrWanted, values);
        this._DataStore.ThrowErrorNotExpectedAffectedRowsCount(affectedRows, 1);

        // Fetch ように値設定
        const wanted4fetch = new TrWanted();
        EntityMerge.Array2Entity(src, wanted4fetch, fields);
        return { wanted: wanted4fetch };
    }

    public async Upsert (wanted: TrWanted): Promise<void> {

        const rev = Number(wanted.revision);
        // ■更新時の抽出条件
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
        // ■更新（更新）時の設定値
        const values: { [key: string]: any } = {};
        EntityMerge.Array2Entity([
            rev + 1,
            wanted.name,
            wanted.prize_money,
            wanted.warning,
            wanted.image_base64,
        ], values, [
            this.FIELD_REVISION,
            this.FIELD_NAME,
            this.FIELD_PRIZE,
            this.FIELD_WARNING,
            this.FIELD_IMAGE_BASE64,
        ]);
        const affectedRows = await this._DataStore.Update(TrWanted, values, conditions);
        this._DataStore.ThrowErrorNotExpectedAffectedRowsCount(affectedRows, 1);
    }

    public async Fetch (whois: string, uuid: string, revision: number): Promise<{ wanted: TrWanted }> {

        const rev = Number(revision);
        // ▽更新後のデータ再取得
        const conditions: { [key: string]: any } = {};
        EntityMerge.Array2Entity([
            whois,
            uuid,
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
