import { TrWanted } from '../app.entities/tr.wanted';
import { KvpMap } from '../app.utils/KvpMap';
import { EntityManager } from 'typeorm';

export default class WantedDoneDomain {

    // TODO: エンティティのフィールド定義 meta へ移動
    // 本当は TrWanted.PrototypeNames.uuid -> "uuid" みたいに取得できればいいけど。。。
    // やり方が分からない Orz
    protected FIELD_WHOIS = 'whois';
    protected FIELD_UUID = 'uuid';
    protected FIELD_REVISION = 'revision';
    protected FIELD_ENABLED = 'enabled';
    protected FIELD_DONE = 'done';

    protected EntityManager!: EntityManager;
    constructor (entityManager: EntityManager) {
        this.EntityManager = entityManager;
    }

    public async Done (
        wanted: TrWanted
    ): Promise<{
        whois: string,
        uuid: string,
        revision: number
    }> {

        const rev = Number(wanted.revision);
        const nextRev = rev + 1;

        await new TrWanted().Update(
            this.EntityManager,
            {
                revision    : nextRev,
                done        : wanted.done
            },
            {
                whois   : wanted.whois,
                uuid    : wanted.uuid,
                revision: wanted.revision
            });

        return {
            whois   : wanted.whois,
            uuid    : wanted.uuid,
            revision: nextRev,
        };
    }

    public async Fetch (
        whois: string,
        uuid: string,
        revision: number
    ): Promise<{
        wanted: TrWanted
    }> {
        // ■抽出条件
        const condition = new KvpMap()
        .Add2Map(this.FIELD_WHOIS, whois)
        .Add2Map(this.FIELD_UUID, uuid)
        .Add2Map(this.FIELD_REVISION, revision)
        .Map;
        
        const repo = this.EntityManager.getRepository(TrWanted);
        const wanted = await repo.findOne({
            where: condition,
        });
        return { wanted: wanted! };
    }
}
