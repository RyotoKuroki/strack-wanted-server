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

    /** リビジョン更新 */
    public static UpRev (entity: TrWanted) {
        entity.revision = Number(entity.revision) + Number(1);
    }

    protected static ParsePrimitive (value: any, typ: string) {
        return typ === 'string' ? value.toString()
            : typ === 'number' ? Number(value)
            : value;
    }
    /**
     * src -> dest へデータマージ。
     * マージ対象とする項目は fields で指定。
     */
    public static MergeEntity2Entity (src: TrWanted, dest: { [key: string]: any }, fields?: any[]) {
        if (!fields) {
            fields = new Array<any>();
            for (let proto in TrWanted.prototype)
                fields.push(proto.toString())
        }
        fields.forEach((field, index) =>
            dest[field] = TrWanted.ParsePrimitive(src[field], typeof(src[field])));
    }

    /**
     * Undefined 以外のフィールドの値を置換え。
     * src に設定された要素数と fields の要素数を合わせる必要があります。
     */
    public static MergeArray2Entity (src: any[], dest: { [key: string]: any }, fields: any[]) {
        if (src.length !== fields.length)
            throw new Error(`エンティティ間のマージ失敗（array -> entity）\r\nsrc要素数とフィールド数を一致させて下さい。`);
        
        fields.forEach((field, index) =>
            dest[field] = TrWanted.ParsePrimitive(src[index], typeof(src[field])));
    }

    /**
     * とりあえず、汎用性が効きそうな条件での抽出処理のみここに実装する！
     * 複雑で特殊な抽出はここには実装しない！！
     */
    public static async Fetch_ByEntity (condition: { [key: string]: any }) {
        return await TrWanted.find({ where: condition });
    }
}

/**
 * データの登録・更新時に必要なキー情報。
 * エンティティ情報の更新時、これらが全て一致する情報を更新対象とする。
 * 一つでも一致しない場合は更新処理失敗とする。
 * 
 *   uuid: エンティティを特定するために使用
 *   revision: バージョン（排他）制御のために使用
 *   whois: エンティティの所有者特定のために使用。
 *          本当は・・
 *          クライアントには送信せず、サーバ側で管理するためのキー情報。
 *          uuid, revision 等はクライアント側で改ざん可能なため、それらとは別に情報の所有者を管理！
 *          ただし今回はそこまで作り込まないため、不要。。。
 */
export class PatchSpecifyKeys {
    public readonly uuid!: string;
    public readonly revision!: number;
    public readonly whois!: string;
    constructor(uuid: string, revision: number, whois: string) {
        this.uuid = uuid;
        this.revision = revision;
        this.whois = whois;
    }
}
