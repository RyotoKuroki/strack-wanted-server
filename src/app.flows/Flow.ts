import { createConnection, BaseEntity, Connection, QueryRunner } from 'typeorm';
import Accessor from '../app.db.accessors/Accessor';
import AccessorConfig from '../app.db.accessors/Accessor.Config';

export default class Flow {

    protected _Accessor!: Accessor;
    public get Accessor(): Accessor { return this._Accessor; }

    public async Run(entities: Array<any>): Promise<any> {
        const accessor = new Accessor();
        const config = AccessorConfig.GetConfig(entities);
        this._Accessor = await accessor.CreateConnection(config);
        return {};
    }
    // 暫定コメントアウト
    /*
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
    */
}