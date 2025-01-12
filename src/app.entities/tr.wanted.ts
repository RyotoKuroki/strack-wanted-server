import {
    Entity,
    Column,
    BaseEntity,
    PrimaryColumn,
    EntityManager,
    InsertResult,
    UpdateResult,
    DeleteResult
} from 'typeorm'
import ITR_Wanted from 'strack-wanted-meta/dist/entities/I.tr.wanted';
import { EntityEnableStates } from 'strack-wanted-meta/dist/consts/states/states.entity.enabled';

@Entity()
export class TrWanted extends BaseEntity implements ITR_Wanted {
    /**  サロゲートキー */
    @PrimaryColumn() /* or @PrimaryGeneratedColumn('uuid') */
    public uuid: string = '';
    /** ユーザを表すキー */
    @Column({ length: 256 })
    public whois: string = '';
    /** 情報の利用可否 enable/disable */
    @Column({ length: 256 })
    public enabled: string = EntityEnableStates.ENABLE;
    /** バージョン */
    @Column('double')
    public revision: number = 0;
    /** ターゲット名 */
    @Column({ length: 256 })
    public name: string = '';
    /** ターゲット確保時の懸賞金 */
    @Column('double')
    public prize_money: number = 0;
    /** ターゲットの画像 */
    @Column('longtext')
    public image_base64: string = '';
    /** ターゲットに関する要注意情報！ */
    @Column({ length: 256 })
    public warning: string = '';
    /** ターゲット確保済み！ ''/done */
    @Column({ length: 256 })
    public done: string = '';

    constructor () {
        super();
        this.revision = 0;
    }

    public async Insert (
        entityManager: EntityManager,
        entry: TrWanted
    ): Promise<number> {
        
        // ゼロ件の場合は終了
        if (entry == null) {
            return 0;
        }

        const result: InsertResult = await entityManager.getRepository(TrWanted)
            .createQueryBuilder()
            .insert()
            .into(TrWanted)
            .values([ entry ])
            .execute();
        
        return result.raw.affectedRows == null
            ? 0
            : result.raw.affectedRows!;
    }

    public async Update (
        entityManager: EntityManager,
        sets: {
            revision: number,
            enabled?: string,

            name?: string,
            prize_money?: number,
            image_base64?: string,
            warning?: string,
            done?: string,
        },
        where: {
            uuid: string,
            whois: string,
            revision: number,
            enabled?: string,
        }
    ): Promise<number> {

        const repo = entityManager.getRepository(TrWanted);
        const builder = repo.createQueryBuilder();
        const updBuilder = builder.update(TrWanted);
        updBuilder.set(sets);
        updBuilder.where(where);
        const result: UpdateResult = await updBuilder.execute();

        return result.affected == null
            ? 0
            : result.affected!;
    }

    public async Delete (
        entityManager: EntityManager,
        where: {
            uuid: string,
            whois: string,
            revision: number,
        }
    ): Promise<number> {
        const result: DeleteResult = await entityManager.getRepository(TrWanted)
            .createQueryBuilder()
            .delete()
            .from(TrWanted)
            .where(where)
            .execute();

        return result.affected == null
            ? 0
            : result.affected!;
    }
}
