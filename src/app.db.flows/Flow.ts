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
    /*
    /** begin transaction * /
    public async BeginTransaction() {
        return await this._Accessor.BeginTransaction();
    }
    /** commit * /
    public async Commit() {
        return await this._Accessor.CommitTransaction();
    }
    /** rollback * /
    public async Rollback() {
        return await this._Accessor.RollbackTransaction();
    }
    /** release * /
    public async Release() {
        return await this._Accessor.Release();
    }
    */
}