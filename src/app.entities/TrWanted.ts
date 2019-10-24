import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
import ITR_Wanted from 'strack-wanted-meta/src/entities/I.tr.wanted';
import uuid from 'node-uuid';

@Entity()
export class TrWanted extends BaseEntity implements ITR_Wanted {
    /**  サロゲートキー */
    @PrimaryGeneratedColumn()
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
}

/**
 * データの登録・更新時に必要なキー情報。
 * 現状は。データ所有者を特定するための whois、Wanted 情報を特定するための uuid と、バージョン管理のための revision。
 */
export class PatchSpecifyKeys {
    public readonly whois!: string;
    public readonly uuid!: string;
    public readonly revision!: number;
    constructor(whois: string, uuid: string, revision: number) {
        this.whois = whois;
        this.uuid = uuid;
        this.revision = revision;
    }
}
