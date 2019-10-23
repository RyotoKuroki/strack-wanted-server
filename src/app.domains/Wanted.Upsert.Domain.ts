// import { WantedDoneRepository } from "../../app.domains.repositories/wanted.done/Wanted.Done.Repository";
import IWantedUpsertRepository from "../app.domains.repositories/wanted.upsert/I.Wanted.Upsert.Repository";
import { PatchSpecifyKeys, TrWanted } from '../app.entities/TrWanted';
import { DoneStatesConsts } from '../app.consts/states/states.done';

export default class WantedUpsertDomain {

    // TODO: static
    protected DoneStates = DoneStatesConsts();

    protected _WantedUpsertRepository!: IWantedUpsertRepository;

    constructor(protected wantedUpsertRepository: IWantedUpsertRepository) {
        this._WantedUpsertRepository = wantedUpsertRepository;
    }

    public async Upsert(whois: string, wanted: TrWanted): Promise<IWantedUpsertRepository> {

        // クライアントから受信した、Wanted 情報を特定するためのキーを使用し、DBレコード抽出
        // 更新対象の Wanted 情報を抽出し、保持する
        const specifyKeys = new PatchSpecifyKeys(whois, wanted.uuid, wanted.revision);
        await this._WantedUpsertRepository.StoreWanted(specifyKeys);
        // Done 変更
        await this._WantedUpsertRepository.Modify(
            whois,
            wanted.name,
            wanted.prize_money,
            wanted.warning,
            wanted.image_base64);
        // DB更新
        await this._WantedUpsertRepository.Save();
        return this._WantedUpsertRepository;
    }
}