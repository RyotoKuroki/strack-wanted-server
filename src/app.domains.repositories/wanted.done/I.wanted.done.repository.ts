import { PatchSpecifyKeys } from '../../app.entities/tr.wanted';

export default interface IWantedDoneRepository {
    /**
     * DB検索。
     * Wanted情報を特定して、１件取得
     * @param specifyKeys 
     */
    StoreWanted(specifyKeys: PatchSpecifyKeys): Promise<any>;
    /**
     * Done情報を編集
     * @param done 
     */
    ChangeDoneState(done: boolean): Promise<any>;
    /**
     * DB更新
     */
    Update(): Promise<any>;
}
