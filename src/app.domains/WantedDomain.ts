// import { EntityManager, QueryRunner } from "typeorm";
import Flow from "../app.db.flows/Flow";
import TrWanted from "../app.db.entities/TrWanted";
import IDomain from "./IDomain";

export default class WantedDomain implements IDomain {
    
    public static readonly ENABLED_STATUS__ENABLED: string = 'enable'; // TODO: strack-wanted-meta に持って行って共通定義化

    _Flow!: Flow;
    public SetFlow(flow: Flow) {
        this._Flow = flow;
    }

    constructor(flow: Flow) {
        this.SetFlow(flow);
    }

    /**
     * Wanted 情報を1件取得。
     * 取得できない場合は undefined。
     * @param uuid 
     * @param revision 
     * @param enabled
     */
    public async FindOne(uuid: string, revision: number, enabled?: string): Promise<TrWanted | undefined> {

        const wanted = await TrWanted.findOne({
            where: {
                enabled: (enabled !== undefined) ? enabled : WantedDomain.ENABLED_STATUS__ENABLED,
                uuid: uuid,
                revision: revision
            }
        });
        return wanted;
    }

    /**
     * Wanted 情報を全て取得。
     * @param enabled
     */
    public async FindAll(enabled?: string) {

        const wanteds = await TrWanted.find({
            where: {
                enabled: (enabled !== undefined) ? enabled : WantedDomain.ENABLED_STATUS__ENABLED,
            },
            // order: { ['name']: 'ASC' }
        });
        return wanteds;
    }

    /**
     * Wanted 情報の Done 状態を更新。
     * @param wanted 
     * @param done 
     */
    public async UpdateDone(wanted: TrWanted, done: string) {

        wanted.done = done;
        wanted.revision = ++wanted.revision;
        const saved = await this._Flow.Upsert(wanted);
        return saved;
    }
}