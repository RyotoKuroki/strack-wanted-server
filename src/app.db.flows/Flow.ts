import Accessor from '../app.db.accessors/Accessor';
import { createConnection, BaseEntity, Connection, QueryRunner } from 'typeorm';

export default class Flow {

    protected _Accessor!: Accessor;

    public async Run(entities: Array<any>): Promise<any> {
        const accessor = new Accessor();
        const config = accessor.GetConfig(entities);
        this._Accessor = await accessor.CreateConnection(config);
        console.log(`accessor created`);
        return {};
    }
    public async BeginTransaction() {
        this._Accessor.BeginTransaction();
    }
    public async Commit() {
        this._Accessor.CommitTransaction();
    }
    public async Rollback() {
        this._Accessor.RollbackTransaction();
    }
    public async Release() {
        return this._Accessor.Release();
    }
}