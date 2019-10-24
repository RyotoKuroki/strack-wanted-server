import IWantedDoneRepository from "../app.domains.repositories/wanted.done/I.Wanted.Done.Repository";
import { PatchSpecifyKeys, TrWanted } from '../app.entities/TrWanted';
import { DoneStatesConsts } from '../app.consts/states/states.done';

export default class WantedDoneDomain {

    // TODO: use static
    protected DoneStates = DoneStatesConsts();

    protected _WantedDoneRepository!: IWantedDoneRepository;

    constructor(protected wantedDoneRepository: IWantedDoneRepository) {
        this._WantedDoneRepository = wantedDoneRepository;
    }

    public async Done(whois: string, wanted: TrWanted): Promise<IWantedDoneRepository> {

        // クライアントから受信した、Wanted 情報を特定するためのキーを使用し、DBレコード抽出
        // 更新対象の Wanted 情報を抽出し、保持する
        const specifyKeys = new PatchSpecifyKeys(whois, wanted.uuid, wanted.revision);
        await this._WantedDoneRepository.StoreWanted(specifyKeys);
        // 編集
        await this._WantedDoneRepository.ChangeDoneState(wanted.done === this.DoneStates.DONE);
        // DB更新
        await this._WantedDoneRepository.UpdateDone();
        return this._WantedDoneRepository;
    }
}
