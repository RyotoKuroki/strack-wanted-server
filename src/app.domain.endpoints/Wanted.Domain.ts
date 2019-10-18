// import { EntityManager, QueryRunner } from "typeorm";
import Datastore from "../app.infras/infra.datastores/DataStore";
import TrWanted from "../app.entities/TrWanted";
import IDomain from "./I.Domain";
import uuid from 'node-uuid';

export default class WantedDomain implements IDomain {
    
    // TODO: strack-wanted-meta に持って行って共通定義化
    public static readonly ENABLED_STATUS__ENABLED: string = 'enable';
    public static readonly ENABLED_STATUS__DISABLED: string = 'disable';
    
    // TODO: strack-wanted-meta に持って行って共通定義化
    public static readonly DONE_STATUS__DONE: string = 'done';
    
    // dbstore
    _Datastore!: Datastore;

    /**
     * コンストラクタ
     * @param datastore 
     */
    constructor(datastore: Datastore) {
        this._Datastore = datastore;
    }

    /**
     * データ登録・更新時、データを特定するためのキー生成
     * @param uuid 
     * @param revision 
     */
    public CreatePatchSpecifyKeys(uuid: string, revision: number) {
        const patchKeys = new PatchSpecifyKeys(uuid, revision);
        return patchKeys;
    }
    
    /**
     * Wanted 情報を1件取得。
     * 取得できない場合は undefined。
     * @param patchKeys 
     * @param enabled
     */
    public async FindOne(patchKeys: PatchSpecifyKeys, enabled?: string): Promise<TrWanted | undefined> {

        let conditions = {
            where: {
                uuid: patchKeys.uuid,
                revision: patchKeys.revision
            }
        };
        conditions = this.setConditionEnabled(conditions, enabled);
        const wanted = await TrWanted.findOne(conditions);
        return wanted;
    }

    /**
     * Wanted 情報を1件取得。
     * 取得できない場合はエラー。
     * @param patchKeys 
     * @param enabled
     */
    public async FindOneOrError(patchKeys: PatchSpecifyKeys, enabled?: string): Promise<TrWanted> {

        const one = await this.FindOne(patchKeys, enabled);

        if(!one)
            throw new NotFoundSuchWantedError('not found', 'not found', '');
        
        return one;
    }

    /**
     * Wanted 情報を全て取得。
     * @param enabled
     */
    public async FindMatches(enabled?: string) {
        let conditions = { where: {} };
        conditions = this.setConditionEnabled(conditions, enabled);
        return await TrWanted.find(conditions);
    }

    /**
     * Wanted 情報の Done 状態を更新。
     * @param patchKeys 
     * @param done 
     */
    public async UpdateDone(patchKeys: PatchSpecifyKeys, done: boolean) {
        const one = await this.FindOneOrError(patchKeys);
        one.done = done ? WantedDomain.DONE_STATUS__DONE : '';
        one.revision = ++one.revision;
        const result = await this._Datastore.Update(one);

        // 更新結果が無い場合はエラー
        // ※排他エラー
        if(!result)
            throw new NotFoundSuchWantedError('Not found', 'Not found', '');

        return result;
    }

    /**
     * Wanted 情報を削除（論理）。
     * @param patchKeys 
     */
    public async Remove(patchKeys: PatchSpecifyKeys) {

        const one = await this.FindOneOrError(patchKeys);
        one.enabled = 'disable';
        one.revision = ++one.revision;
        const result = await this._Datastore.Update(one);

        // 更新結果が無い場合はエラー
        // ※排他エラー
        if(!result)
            throw new NotFoundSuchWantedError('Not found', 'Not found', '');

        return result;
    }

    /**
     * Wanted 情報を更新。
     * @param patchKeys 
     * @param values 
     */
    public async Update(patchKeys: PatchSpecifyKeys, values: {
            name?: string,
            prize_money?: number,
            warning?: string,
            image_base64?: string })
    {
        const one = await this.FindOneOrError(patchKeys);
        if(values.name) one.name = values.name;
        if(values.prize_money) one.prize_money = values.prize_money;
        if(values.warning) one.warning = values.warning;
        if(values.image_base64) one.image_base64 = values.image_base64;
        const result = await this._Datastore.Update(one);

        // 更新結果が無い場合はエラー
        // ※排他エラー
        if(!result)
            throw new CouldNotUpdateError('Failed update.', 'Failed update', '');
        
        return result;
    }

    /**
     * Wanted 情報を新規登録。
     * @param values 
     */
    public async Insert(
        values: {
            name?: string,
            prize_money?: number,
            warning?: string,
            image_base64?: string }
    ) {
        const one: TrWanted = new TrWanted();
        one.uuid = `${uuid.v4()}-${Date.now()}`;
        one.revision = 0;
        one.enabled = WantedDomain.ENABLED_STATUS__ENABLED;
        one.done = '';
        if(values.name) one.name = values.name;
        if(values.prize_money) one.prize_money = values.prize_money;
        if(values.warning) one.warning = values.warning;
        if(values.image_base64) one.image_base64 = values.image_base64;
        return await this._Datastore.Insert(TrWanted, one);
    }

    /**
     * enabled フィールドを設定
     * @param condition 
     * @param enabled 
     */
    protected setConditionEnabled(condition: any, enabled?: string): any {
        if(enabled !== undefined) {
            condition.where.enabled = enabled;
        }
        return condition;
    }
}

/**
 * 抽出条件に見合うデータが存在しない場合のエラー
 */
export class NotFoundSuchWantedError extends Error {
    public code: string;
    public message: string;
    public stack?: string;
    constructor(code: string, message: string, stack?: string) {
        super();
        this.code = code;
        this.message = message;
        this.stack = stack;
    }
}

/**
 * 更新処理失敗時のエラー
 */
export class CouldNotUpdateError extends Error {
    public code: string;
    public message: string;
    public stack?: string;
    constructor(code: string, message: string, stack?: string) {
        super();
        this.code = code;
        this.message = message;
        this.stack = stack;
    }
}

/**
 * データの登録・更新時に必要なキー情報。
 * 現状は。情報を特定するための uuid と、バージョン管理のための revision。
 */
export class PatchSpecifyKeys {
    public readonly uuid!: string;
    public readonly revision!: number;
    constructor(uuid: string, revision: number) {
        this.uuid = uuid;
        this.revision = revision;
    }
}
