import IWantedDeleteRepository from "../app.domains.repositories/wanted.delete/I.Wanted.Delete.Repository";
import { PatchSpecifyKeys, TrWanted } from '../app.entities/TrWanted';
import { EntityEnabledStatesConsts } from '../app.consts/states/states.entity.enabled';

export default class WantedDeleteDomain {

    // TODO: use static
    protected EntityEnabledStates = EntityEnabledStatesConsts();

    protected _WantedDeleteRepository!: IWantedDeleteRepository;

    constructor(protected wantedDeleteRepository: IWantedDeleteRepository) {
        this._WantedDeleteRepository = wantedDeleteRepository;
    }

    public async Remove(whois: string, wanted: TrWanted): Promise<IWantedDeleteRepository> {

        // クライアントから受信した、Wanted 情報を特定するためのキーを使用し、DBレコード抽出
        // 更新対象の Wanted 情報を抽出し、保持する
        const specifyKeys = new PatchSpecifyKeys(whois, wanted.uuid, wanted.revision);
        await this._WantedDeleteRepository.StoreWanted(specifyKeys);
        // 編集
        await this._WantedDeleteRepository.ChangeEnabledState(wanted.enabled === this.EntityEnabledStates.ENABLED);
        // DB更新
        await this._WantedDeleteRepository.Remove();
        return this._WantedDeleteRepository;
    }
}
