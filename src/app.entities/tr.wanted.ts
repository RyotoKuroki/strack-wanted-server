import { Entity, Column, BaseEntity, PrimaryColumn } from 'typeorm'
import ITR_Wanted from 'strack-wanted-meta/dist/entities/I.tr.wanted';
import { EntityEnableStates } from 'strack-wanted-meta/dist/consts/states/states.entity.enabled';
import DataStore from '../app.infras/datastores/datastore';

@Entity()
export class TrWanted extends BaseEntity implements ITR_Wanted {
    /**  サロゲートキー */
    @PrimaryColumn() /* or @PrimaryGeneratedColumn('uuid') */
    public uuid: string = '';
    /** ユーザを表すキー */
    @Column({ length: 256 })
    public whois: string = '';
    /** 情報の利用可否 enable/disable */
    @Column({ length: 256 })
    public enabled: string = EntityEnableStates.ENABLE;
    /** バージョン */
    @Column('double')
    public revision: number = 0;
    /** ターゲット名 */
    @Column({ length: 256 })
    public name: string = '';
    /** ターゲット確保時の懸賞金 */
    @Column('double')
    public prize_money: number = 0;
    /** ターゲットの画像 */
    @Column('longtext')
    public image_base64: string = '';
    /** ターゲットに関する要注意情報！ */
    @Column({ length: 256 })
    public warning: string = '';
    /** ターゲット確保済み！ ''/done */
    @Column({ length: 256 })
    public done: string = '';

    constructor () {
        super();
        this.revision = 0;
    }

    /** インクリメントしたリビジョン値取得 */
    public static GetNextRev (current?: number) {
        return !current ? 1 : (current + 1);
    }

    public static async InTran_Fetch (dataStore: DataStore, conditions: { [key: string]: any } | TrWanted) {
        return await dataStore.Fetch({
            schema: TrWanted,
            schemaAlias: 'TrWanted',
            where: conditions,
        });
    }

    public static async InTran_Insert (dataStore: DataStore, overview: { [key: string]: any } | TrWanted) {
        return await dataStore.Insert(TrWanted, overview);
    }

    public static async InTran_Update (dataStore: DataStore, values: { [key: string]: any } | TrWanted, conditions: { [key: string]: any } | TrWanted) {
        return await dataStore.Update(TrWanted, values, conditions);
    }
}
