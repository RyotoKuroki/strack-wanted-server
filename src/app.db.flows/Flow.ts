import { createConnection, BaseEntity, Connection, QueryRunner, EntityManager } from 'typeorm';
import Accessor from '../app.db.accessors/Accessor';
import AccessorConfig from '../app.db.accessors/Accessor.Config';

export default class Flow {

    protected _Accessor!: Accessor;
    public get Accessor(): Accessor { return this._Accessor; }

    /**
     * DB接続の下処理を実施。
     * トランザクション管理なし。
     * @param entities 
     */
    public async Run(entities: Array<any>): Promise<any> {
        const accessor = new Accessor();
        const config = AccessorConfig.GetConfig(entities);
        this._Accessor = await accessor.CreateConnection(config);
        return {};
    }
    /**
     * DB接続の下処理のテンプレート。
     * トランザクション管理も合わせて実施。
     * @param entities 
     * @param patchInTran 
     */
    public async RunWithTransaction<BaseEntity>(entities: BaseEntity[], patchInTran: (result: any) => Promise<any>): Promise<any> {
        const accessor = new Accessor();
        const config = AccessorConfig.GetConfig(entities);
        this._Accessor = await accessor.CreateConnection(config);
        try{
            await this.Transaction();
            const result = await patchInTran({});
            await this.Commit();
            await this.Release();
            return result;
        } catch(ex) {
            await this.Rollback();
            await this.Release();
            throw new Error(`error in runWithTran.`);
        }
    }
    /** begin tran */
    public async Transaction() {
        return await this._Accessor.QueryRunner.startTransaction();
    }
    /** upsert */
    public async Upsert<T extends BaseEntity>(entity: T) {
        // TrWanted.save(); のような方法でも、エンティティ情報のDB登録は可能だが、これだとトランザクション管理できない。
        // 具体的には、TrWanted.save(); 後に、rollback 処理を呼んでもデータ状態が戻らない。。。
        // そのため、QueryRunner を経由して save 処理を行うこととする。
        return await this._Accessor.QueryRunner.manager.save(entity);
        //return await entity.save();
    }
    /** commit */
    public async Commit() {
        return await this._Accessor.QueryRunner.commitTransaction();
    }
    /** rollback */
    public async Rollback() {
        return await this._Accessor.QueryRunner.rollbackTransaction();
    }
    /** release */
    public async Release() {
        return await this.Accessor.QueryRunner.release();
    }
}