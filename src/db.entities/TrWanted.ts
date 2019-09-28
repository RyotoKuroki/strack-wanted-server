import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
// import ITR_Base from '../../app.table.interfaces/ITR_Base';
// import ITR_Wanted from '../../app.db.interfaces/ITR_Wanted';

@Entity()
export default class TrWanted extends BaseEntity/* implements ITR_Wanted*/ {
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
    @Column({ length: 256000 })
    public image: string = '';
    /**
     * 注意！
     */
    @Column({ length: 256 })
    public warning: string = '';
}