import { WantedDoneRepository } from "../../app.domains.repositories/wanted.done/Wanted.Done.Repository";
import { PatchSpecifyKeys } from '../../app.entities/TrWanted';
import { DoneStatesConsts } from '../../app.consts/states/states.done';

export default class WantedDoneDomain {

    // TODO: static
    protected DoneStates = DoneStatesConsts();

    protected _WantedDoneRepository!: WantedDoneRepository;

    constructor(protected wantedDoneRepository: WantedDoneRepository) {
        this._WantedDoneRepository = wantedDoneRepository;
    }

    public async Done(dto: any): Promise<WantedDoneRepository> {

        // クライアントから受信した、Wanted 情報を特定するためのキーを使用し、DBレコード抽出
        // 更新対象の Wanted 情報を抽出し、保持する
        const specifyKeys = new PatchSpecifyKeys(dto.uuid, dto.revision);
        await this._WantedDoneRepository.StoreWanted(specifyKeys);
        // Done 変更
        await this._WantedDoneRepository.ChangeDoneState(dto.done === this.DoneStates.DONE);
        // DB更新
        await this._WantedDoneRepository.UpdateDone();
        return this._WantedDoneRepository;
    }
}