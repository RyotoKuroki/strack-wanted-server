import { PatchSpecifyKeys } from '../../app.entities/TrWanted';

export default interface IWantedDeleteRepository {
    /**
     * DB検索。
     * Wanted情報を特定して、１件取得
     * @param specifyKeys 
     */
    StoreWanted(specifyKeys: PatchSpecifyKeys): Promise<any>;
    /**
     * Wanted 情報を編集
     * @param enabled 
     */
    ChangeEnabledState(enabled: boolean): Promise<any>;
    /**
     * DB更新（論理削除）
     */
    Remove(): Promise<any>;
}
