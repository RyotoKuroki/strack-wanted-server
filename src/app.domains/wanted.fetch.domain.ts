import IWantedFetchRepository from "../app.domains.repositories/wanted.fetch/I.wanted.fetch.repository";

export default class WantedFetchDomain {

    _WantedFetchRepository!: IWantedFetchRepository;

    constructor(wantedFetchRepository: IWantedFetchRepository) {
        this._WantedFetchRepository = wantedFetchRepository;
    }

    public async StoreWanteds(dto: any): Promise<IWantedFetchRepository> {

        // 更新対象の Wanted 情報を抽出し、保持する
        await this._WantedFetchRepository.StoreWanteds(dto.whois);
        return this._WantedFetchRepository;
    }
}
