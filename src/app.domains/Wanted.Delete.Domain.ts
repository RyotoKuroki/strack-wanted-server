import IWantedDeleteRepository from "../app.domains.repositories/wanted.delete/I.Wanted.Delete.Repository";
import { PatchSpecifyKeys } from '../app.entities/TrWanted';

export default class WantedDeleteDomain {

    protected _WantedDeleteRepository!: IWantedDeleteRepository;

    constructor(protected wantedDeleteRepository: IWantedDeleteRepository) {
        this._WantedDeleteRepository = wantedDeleteRepository;
    }

    public async Remove(whois: string, uuid: string, revision: number): Promise<IWantedDeleteRepository> {

        // クライアントから受信した、Wanted 情報を特定するためのキーを使用し、DBレコード抽出
        // 更新対象の Wanted 情報を抽出し、保持する
        const specifyKeys = new PatchSpecifyKeys(whois, uuid, revision);
        await this._WantedDeleteRepository.StoreWanted(specifyKeys);
        // DB更新
        await this._WantedDeleteRepository.Remove();
        return this._WantedDeleteRepository;
    }
}
