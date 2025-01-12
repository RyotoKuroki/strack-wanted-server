import ITR_Account from 'strack-wanted-meta/dist/entities/I.tr.account';
import { EntityEnableStates } from 'strack-wanted-meta/dist/consts/states/states.entity.enabled';

export class TrAccount /*extends BaseEntity*/ implements ITR_Account {
    /** サロゲートキー */
    public uuid: string = '';
    /** ユーザを表すキー */
    public whois: string = '';
    /** 情報の利用可否 enable/disable */
    public enabled: string = EntityEnableStates.ENABLE;
    /** バージョン */
    public revision: number = 0;
    /** ターゲット名 */
    public user_name: string = '';
    /** ターゲットの画像 */
    public image_base64: string = '';
}
