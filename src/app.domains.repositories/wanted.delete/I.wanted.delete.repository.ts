import { PatchSpecifyKeys } from '../../app.entities/tr.wanted';

export default interface IWantedDeleteRepository {
    /**
     * DB検索。
     * Wanted情報を特定して、１件取得
     * @param specifyKeys 
     */
    StoreWanted(specifyKeys: PatchSpecifyKeys): Promise<any>;
    /**
     * DB更新（論理削除）
     */
    Remove(): Promise<any>;
}
