import { PatchSpecifyKeys } from '../../app.entities/TrWanted';

export default interface IBingobookFetchRepository {
    // Wanted: TrWanted;
    /**
     * DB検索。
     * Wanted情報を特定して、１件取得
     * @param whois 
     */
    StoreWanteds(whois: string): Promise<any>;
}