import IBingobookFetchRepository from "../app.domains.repositories/bingobook.fetch/I.Bingobook.Fetch.Repository";

export default class BingobookFetchDomain {

    _BingobookFetchRepository!: IBingobookFetchRepository;

    constructor(protected bingobookFetchRepository: IBingobookFetchRepository) {
        this._BingobookFetchRepository = bingobookFetchRepository;
    }

    public async StoreWanteds(dto: any): Promise<IBingobookFetchRepository> {

        // 更新対象の Wanted 情報を抽出し、保持する
        await this._BingobookFetchRepository.StoreWanteds(dto.whois);
        return this._BingobookFetchRepository;
    }
}
