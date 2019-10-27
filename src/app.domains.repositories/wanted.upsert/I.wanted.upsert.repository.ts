import { PatchSpecifyKeys } from '../../app.entities/tr.wanted';

export default interface IWantedUpsertRepository {
    /**
     * DB検索。
     * Wanted情報を特定して、１件取得
     * @param specifyKeys 
     */
    StoreWanted(specifyKeys: PatchSpecifyKeys): Promise<any>;
    /**
     * Wanted 情報を編集
     */
    Modify(
        whois: string,
        name: string,
        prize_money: number,
        warning: string,
        image_base64: string): Promise<any>;
    /**
     * DB登録/更新
     */
    Save(): Promise<any>;
}
