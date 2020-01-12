import { Entity, Column, BaseEntity, PrimaryColumn } from 'typeorm'
import ITR_Wanted from 'strack-wanted-meta/dist/entities/I.tr.wanted';
import { EntityEnableStates } from 'strack-wanted-meta/dist/consts/states/states.entity.enabled';

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

    /**
     * とりあえず、汎用性が効きそうな条件での抽出処理のみここに実装する！
     * 複雑で特殊な抽出はここには実装しない！！
     */
    public static async Fetch_ByEntity (condition: { [key: string]: any }) {
        return await TrWanted.find({ where: condition });
    }
}
