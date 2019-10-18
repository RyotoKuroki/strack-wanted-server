import Accessor from './datastore.accessors/Accessor';
import AccessorConfig from './datastore.accessors/Accessor.Config';

export default class DataStore {

    protected _Accessor!: Accessor;

    /**
     * DB接続の下処理を実施。
     * トランザクション管理なし。
     * @param entities 
     */
    public async Run(entities: Array<any>, patch: (result: any) => Promise<any>): Promise<any> {
        const accessor = new Accessor();
        const config = AccessorConfig.GetConfig(entities);
        this._Accessor = await accessor.CreateConnection(config);

        try {
            const result = await patch({});
            return result;

        } catch(ex) {
            throw new Error(ex);
        } finally {
            await this.Release();
        }
    }
    /**
     * DB接続の下処理のテンプレート。
     * トランザクション管理も合わせて実施。
     * @param entities 
     * @param patchInTran 
     */
    public async RunWithTransaction(entities: any[], patchInTran: (result: any) => Promise<any>): Promise<any> {
        const accessor = new Accessor();
        const config = AccessorConfig.GetConfig(entities);
        this._Accessor = await accessor.CreateConnection(config);

        try {
            await this.Transaction();
            const result = await patchInTran({});
            await this.Commit();
            return result;

        } catch(ex) {
            await this.Rollback();
            throw new Error(ex);
        } finally {
            await this.Release();
        }
    }
    /** begin tran */
    public async Transaction() {
        return await this._Accessor.QueryRunner.startTransaction();
    }
    /** upsert */
    public async Update(entity: any) {
        // TrWanted.save(); のような方法でも、エンティティ情報のDB登録は可能だが、これだとトランザクション管理できない。
        // そのため、QueryRunner を経由して save 処理を行うこととする。
        const result = await this._Accessor.QueryRunner.manager.save(entity);
        return result;
    }
    /** upsert */
    public async Insert(schema: any, values: any) {
        const builder = this._Accessor.QueryRunner.manager.createQueryBuilder();
        const result = await builder
        .insert()
        .into(schema)
        .values(values)
        .execute();
        return result;
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
        return await this._Accessor.QueryRunner.release();
    }
}
