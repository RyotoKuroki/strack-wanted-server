import Accessor from './datastore.mysql.accessors/accessor.mysql';
import AccessorConfig from './datastore.mysql.accessors/accessor.mysql.config';
import { BaseEntity, QueryRunner } from 'typeorm';
import { TrWanted } from '../../app.entities/tr.wanted';

export default class DataStore {

    protected _Accessor!: Accessor;
    protected _QueryRunner!: QueryRunner;
    // public get QueryRunner(): QueryRunner { return this._QueryRunner; }

    public static async Init(/*entities: Array<any>*/) {
        const config = AccessorConfig.GetConfig([
            TrWanted,
        ]);
        /*this._Accessor = */await Accessor.CreateConnection(config);
        return this;
    }

    public async CreateRunner () {
        this._Accessor = new Accessor();
        const runner = this._Accessor.FetchConnection().createQueryRunner();
        this._QueryRunner = runner;
    }

    /**
     * DB接続の下処理を実施。
     * トランザクション管理なし。
     * @param patch 
     */
    public async Run(patch: (result: any) => Promise<any>): Promise<any> {
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
     * @param patchInTran 
     */
    public async RunWithTransaction(patchInTran: (result: any) => Promise<any>): Promise<any> {
        try {
            await this.Transaction();
            const result = await patchInTran({});
            await this.Commit();
            return result;

        } catch(ex) {
            console.log(`ex in datastore : ${ex}`);
            await this.Rollback();
            throw new Error(ex);
        } finally {
            await this.Release();
        }
    }
    /** begin tran */
    public async Transaction() {
        await this._QueryRunner.startTransaction();
    }

    /** insert */
    public async Insert(schema: any, values: {[key: string]: any;}): Promise<number> {
        const builder = this._QueryRunner.manager.createQueryBuilder();
        const result = await builder
        .insert()
        .into(schema)
        .values(values)
        .execute();
        return result.raw.affectedRows;
    }
    /** update */
    public async Update(schema: any, valuesEntity: {[key: string]: any;}, wheresEntity: {[key: string]: any;}): Promise<number> {
        const builder = this._QueryRunner.manager.createQueryBuilder();
        const result = await builder
        .update(schema)
        .set(valuesEntity)
        .whereEntity(wheresEntity)
        .execute();
        return result.raw.affectedRows;
    }
    /** delete（物理削除） */
    public async Delete(schema: any, wheresEntity: {[key: string]: any;}): Promise<number> {
        const builder = this._QueryRunner.manager.createQueryBuilder();
        const result = await builder
        .delete()
        .from(schema)
        .where(wheresEntity)
        .execute();
        return result.raw.affectedRows;
    }
    /** insert */
    public async Fetch(options: {
        schema: any,
        schemaAlias: string,
        selections?: string[], 
        where?: { [key: string]: any } }): Promise<any[]> {
        
        const builder = this._QueryRunner.manager.createQueryBuilder(options.schema, options.schemaAlias);
        if (options.selections)
            builder.select(options.selections);
        if (options.where)
            builder.where(options.where);
        const result = await builder.getMany();
        return result;
    }
    /** some query */
    public async PatchManually(patch: (queryBuilder: any) => void): Promise<any> {
        const builder = this._QueryRunner.manager.createQueryBuilder();
        return await patch(builder);
    }

    /**
     * 想定内の件数が更新できたか？
     * 実際の登録/更新件数↔想定件数とで異なる場合、スローエラー。
     * 
     * @param affectedRows 実際の更新件数
     * @param expectedRows 想定の更新件数
     */
    public ThrowErrorNotExpectedAffectedRowsCount (affectedRows: number, expectedRows: number) {
        if (affectedRows !== expectedRows) {
            console.log(`@エラー： 実際の更新件数と想定件数が一致しませんでした。 : affect=${affectedRows}, expect=${expectedRows}`);
            throw new Error(`Error at commitment. Affected-row's count is not expected.`);
        }
    }

    /**
     * 情報の更新に必要なキーで検索した際、データが取得できなかった場合、スローエラー。
     * 
     * @param someEntity 取得結果のエンティティ
     * @param specifyKeys 検索時のキー
     */
    public ThrowErrorNotFoundSpecifyKeysInfo (someEntity: BaseEntity | undefined, specifyKeys: any) {
        if (someEntity === null || someEntity === undefined) {
            console.log(`@エラー： 該当のキーを有する情報が見つかりませんでした。 : keys=${JSON.stringify(specifyKeys)}`);
            throw new Error(`Error at Fetch entity. Entity not found.`);
        }
    }
    /** commit */
    public async Commit() {
        await this._QueryRunner.commitTransaction();
    }
    /** rollback */
    public async Rollback() {
        await this._QueryRunner.rollbackTransaction();
    }
    /** release */
    public async Release() {
        await this._QueryRunner.release();
    }
}
