import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
import ITR_Account from 'strack-wanted-meta/src/entities/I.tr.account';
import uuid from 'node-uuid';

@Entity()
export class TrAccount extends BaseEntity implements ITR_Account {
    /**
     * サロゲートキー
     */
    @PrimaryGeneratedColumn()
    public uuid: string = '';
    /**
     * ユーザを表すキー
     */
    @Column({ length: 256 })
    public whois: string = '';
    /**
     * 情報の利用可否
     * enable/disable
     */
    @Column({ length: 256 })
    public enabled: string = 'enable';
    /**
     * バージョン
     */
    @Column('double')
    public revision: number = 0;
    /**
     * ターゲット名
     */
    @Column({ length: 256 })
    public user_name: string = '';
    /**
     * ターゲットの画像
     */
    @Column('longtext')
    public image_base64: string = '';
}

/**
 * データの登録・更新時に必要なキー情報。
 * 現状は。情報を特定するための whois と、バージョン管理のための revision。
 */
export class PatchSpecifyKeys {
    public readonly whois!: string;
    public readonly revision!: number;
    constructor(whois: string, revision: number) {
        this.whois = whois;
        this.revision = revision;
    }
}
