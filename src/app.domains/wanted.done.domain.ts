import IWantedDoneRepository from "../app.domains.repositories/wanted.done/I.wanted.done.repository";
import { PatchSpecifyKeys, TrWanted } from '../app.entities/tr.wanted';
import { DoneStates } from 'strack-wanted-meta/dist/consts/states/states.done';

export default class WantedDoneDomain {

    protected _WantedDoneRepository!: IWantedDoneRepository;

    constructor(wantedDoneRepository: IWantedDoneRepository) {
        this._WantedDoneRepository = wantedDoneRepository;
    }

    public async Done(whois: string, uuid: string, revision: number, done: string): Promise<IWantedDoneRepository> {

        // クライアントから受信した、Wanted 情報を特定するためのキーを使用し、DBレコード抽出
        // 更新対象の Wanted 情報を抽出し、保持する
        const specifyKeys = new PatchSpecifyKeys(uuid, revision, whois);
        await this._WantedDoneRepository.StoreWanted(specifyKeys);
        // 編集
        await this._WantedDoneRepository.ChangeDoneState(done === DoneStates.DONE);
        // DB更新
        await this._WantedDoneRepository.Update();
        return this._WantedDoneRepository;
    }
}
