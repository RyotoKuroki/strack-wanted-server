import { createConnection, BaseEntity, Connection, QueryRunner } from 'typeorm';
import Accessor from '../app.db.accessors/Accessor';

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
        return await this._Accessor.BeginTransaction();
    }
    public async Commit() {
        return await this._Accessor.CommitTransaction();
    }
    public async Rollback() {
        return await this._Accessor.RollbackTransaction();
    }
    public async Release() {
        return await this._Accessor.Release();
    }
}