import { EntityManager } from "typeorm";
import { TrWanted } from "../app.entities/tr.wanted";
import { KvpMap } from "../app.utils/KvpMap";

export default class WantedFetchDomain {

    // TODO: エンティティのフィールド定義 meta へ移動
    // 本当は TrWanted.PrototypeNames.uuid -> "uuid" みたいに取得できればいいけど。。。
    // やり方が分からない Orz
    protected FIELD_WHOIS = 'whois';
    protected FIELD_UUID = 'uuid';
    protected FIELD_REVISION = 'revision';
    protected FIELD_ENABLED = 'enabled';

    protected EntityManager!: EntityManager;
    constructor (entityManager: EntityManager) {
        this.EntityManager = entityManager;
    }

    public async Fetch (
        whois: string,
        enabled: string
    ): Promise<{
        wanteds: TrWanted[]
    }> {

        // ■抽出条件
        const condition = new KvpMap()
        .Add2Map(this.FIELD_WHOIS, whois)
        .Add2Map(this.FIELD_ENABLED, enabled)
        .Map;

        const repo = this.EntityManager.getRepository(TrWanted);
        const wanteds = await repo.find(condition);
        return { wanteds: wanteds! };
    }

    public async FetchOne (
        whois: string,
        uuid: string,
        revision: number
    ): Promise<{
        wanted: TrWanted | null
    }> {
        // ■抽出条件
        const condition = new KvpMap()
        .Add2Map(this.FIELD_WHOIS, whois)
        .Add2Map(this.FIELD_UUID, uuid)
        .Add2Map(this.FIELD_REVISION, revision)
        //.Add2Map(this.FIELD_ENABLED, enabled)
        .Map;
        
        const repo = this.EntityManager.getRepository(TrWanted);
        const wanted = await repo.findOne({
            where: condition,
        });
        return { wanted: wanted! };
    }
}
