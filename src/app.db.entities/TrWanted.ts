import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
import ITR_Wanted from 'strack-wanted-meta/src/entities/ITR_Wanted';

@Entity()
export default class TrWanted extends BaseEntity implements ITR_Wanted {
    /**
     * サロゲートキー
     */
    @PrimaryGeneratedColumn()
    public uuid: string = '';
    /**
     * ユーザを表すユニークキー
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
    public name: string = '';
    /**
     * 懸賞金
     */
    @Column('double')
    public prize_money: number = 0;
    /**
     * 画像
     */
    @Column('longtext')
    public image_base64: string = '';
    /**
     * 要注意情報！
     */
    @Column({ length: 256 })
    public warning: string = '';
    /**
     * 確保済み！
     * ''/done
     */
    @Column({ length: 256 })
    public done: string = '';
}
