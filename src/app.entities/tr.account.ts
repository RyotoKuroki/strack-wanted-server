import { Entity, Column, BaseEntity, PrimaryColumn } from 'typeorm'
import ITR_Account from 'strack-wanted-meta/dist/entities/I.tr.account';
import { EntityEnableStates } from 'strack-wanted-meta/dist/consts/states/states.entity.enabled';

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
    public enabled: string = EntityEnableStates.ENABLE;
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
