import { Entity, Column, BaseEntity, PrimaryColumn } from 'typeorm'
import ITR_Account from 'strack-wanted-meta/dist/entities/I.tr.account';

@Entity()
export class TrAccount extends BaseEntity implements ITR_Account {
    /** サロゲートキー */
    @PrimaryColumn() /* or @PrimaryGeneratedColumn('uuid') */
    public uuid: string = '';
    /** ユーザを表すキー */
    @Column({ length: 256 })
    public whois: string = '';
    /** 情報の利用可否 enable/disable */
    @Column({ length: 256 })
    public enabled: string = 'enable';
    /** バージョン */
    @Column('double')
    public revision: number = 0;
    /** ターゲット名 */
    @Column({ length: 256 })
    public user_name: string = '';
    /** ターゲットの画像 */
    @Column('longtext')
    public image_base64: string = '';
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
