import IWantedUpsertRepository from "../app.domains.repositories/wanted.upsert/I.wanted.upsert.repository";
import { PatchSpecifyKeys } from '../app.entities/tr.wanted';
import ITR_Wanted from "strack-wanted-meta/dist/entities/I.tr.wanted";

export default class WantedUpsertDomain {

    protected _WantedUpsertRepository!: IWantedUpsertRepository;

    constructor(wantedUpsertRepository: IWantedUpsertRepository) {
        this._WantedUpsertRepository = wantedUpsertRepository;
    }

    public async Upsert(wanted: ITR_Wanted): Promise<IWantedUpsertRepository> {

        // クライアントから受信した、Wanted 情報を特定するためのキーを使用し、DBレコード抽出
        // 更新対象の Wanted 情報を抽出し、保持する
        const specifyKeys = new PatchSpecifyKeys(wanted.uuid, wanted.revision, wanted.whois);
        await this._WantedUpsertRepository.StoreWanted(specifyKeys);
        // 編集
        await this._WantedUpsertRepository.Modify(
            wanted.whois,
            wanted.name,
            wanted.prize_money,
            wanted.warning,
            wanted.image_base64);
        // DB更新
        await this._WantedUpsertRepository.Save();
        return this._WantedUpsertRepository;
    }
}
