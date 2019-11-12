import IWantedDeleteRepository from "../app.domains.repositories/wanted.delete/I.wanted.delete.repository";
import { PatchSpecifyKeys } from '../app.entities/tr.wanted';

export default class WantedDeleteDomain {

    protected _WantedDeleteRepository!: IWantedDeleteRepository;

    constructor(wantedDeleteRepository: IWantedDeleteRepository) {
        this._WantedDeleteRepository = wantedDeleteRepository;
    }

    public async Remove(whois: string, uuid: string, revision: number): Promise<IWantedDeleteRepository> {

        // クライアントから受信した、Wanted 情報を特定するためのキーを使用し、DBレコード抽出
        // 更新対象の Wanted 情報を抽出し、保持する
        const specifyKeys = new PatchSpecifyKeys(uuid, revision, whois);
        await this._WantedDeleteRepository.StoreWanted(specifyKeys);
        // DB更新
        await this._WantedDeleteRepository.Remove();
        return this._WantedDeleteRepository;
    }
}
