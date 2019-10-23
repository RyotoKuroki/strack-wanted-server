import $ from 'jquery';
import { AbsRepository } from '../Abs.Repository';
import IWantedUpsertRepository from './I.Wanted.Upsert.Repository';
import DataStore from '../../app.infras/infra.datastores/DataStore';
import { TrWanted, PatchSpecifyKeys } from '../../app.entities/TrWanted';
import { EntityEnabledStatesConsts } from '../../app.consts/states/states.entity.enabled';
import { DoneStatesConsts } from '../../app.consts/states/states.done';
import uuid from 'node-uuid';

export class WantedUpsertRepository extends AbsRepository implements IWantedUpsertRepository {

    protected EntityEnabledStates = EntityEnabledStatesConsts();
    protected DoneStates = DoneStatesConsts();

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // @@@@@@ override AbsWantedDoneRepository @@@@@@
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    /**
     * StoredWanted 情報のコピーを外部に提供する。
     * Wanted インスタンスを外部に直接晒さないのは、外部から不正な参照方法で編集されることを防ぐための対策。
     */
    public get StoredWanted(): TrWanted {
        // TODO: エラー回避＆コメント解除
        // return $.extend(true, {}, this._Wanted);
        return this._Wanted;
    }
    protected _Wanted!: TrWanted;

    /**
     * DB検索。
     * Wanted情報を特定して、１件取得
     * @param specifyKeys 
     */
    public /* override */ async StoreWanted(specifyKeys: PatchSpecifyKeys): Promise<any> {
        let one = await TrWanted.findOne({
            where: {
                whois: specifyKeys.whois,
                uuid: specifyKeys.uuid,
                revision: specifyKeys.revision,
            }
        });
        if(one === undefined) {
            one = new TrWanted();
        }
        this._Wanted = one;
        return this;
    }
    /**
     * Wanted 情報を編集
     * @param enabled 
     */
    public /* override */ async Modify(
        whois: string,
        name: string,
        prize_money: number,
        warning: string,
        image_base64: string): Promise<any> {
        this._Wanted.name = name;
        this._Wanted.prize_money = prize_money;
        this._Wanted.warning = warning;
        this._Wanted.image_base64 = image_base64;
        return this;
    }

    /**
     * Wanted 情報を更新
     */
    public /* override */ async Save(): Promise<any> {
        if(this._Wanted.uuid === undefined ||
           this._Wanted.uuid === '') {
            this._Wanted.uuid = `${uuid.v4()}-${Date.now()}`;
            this._Wanted.whois = this._Wanted.whois;
            this._Wanted.revision = 1;
            this._Wanted.enabled = this.EntityEnabledStates.ENABLED;
            this._Wanted.done = this.DoneStates.DONE;
            this._Wanted.name = this._Wanted.name;
            this._Wanted.prize_money = this._Wanted.prize_money;
            this._Wanted.warning = this._Wanted.warning;
            this._Wanted.image_base64 = this._Wanted.image_base64;
            await this._DataStore.Insert(TrWanted, this._Wanted);
        } else {
            this._Wanted.name = this._Wanted.name;
            this._Wanted.prize_money = this._Wanted.prize_money;
            this._Wanted.warning = this._Wanted.warning;
            this._Wanted.image_base64 = this._Wanted.image_base64;
            this._Wanted.revision = ++this._Wanted.revision;
            await this._DataStore.Update(this._Wanted);
        }
        return this;
    }



    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // @@@@@@ override AbsRepository @@@@@@
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    protected _DataStore!: DataStore;
    /** DataStore生成 */
    public /* override */ async CreateDataStore(): Promise<any /* Repository */> {
        this._DataStore = await new DataStore();
        await this._DataStore.Init([TrWanted]);
        return this;
    }

    /* 外部からこのリポジトリにDataStoreを設定する場合に実装 */
    public /* override */ async SetDataStore(datastore: DataStore): Promise<any /* Repository */> {
        this._DataStore = datastore;
        return this;
    }

    /** リポジトリがネストした際、このリポジトリを特定するためのハッシュコード作成 */
    public /* override */ async CreateNestedRepository(datastore: DataStore): Promise<any /* Repository */> {
        // 今は不要
        // throw new Error(`CreateNestedRepository not implements exception.`);
        return this;
    }
    
    /** トランザクション管理実施 */
    public /* override */ async Run(fnc: (result: any) => void): Promise<any /* Repository */> {
        return await this._DataStore.Run(async (result: any) => {
            return await fnc(result);
        });
    }
    
    /** トランザクション管理実施 */
    public /* override */ async RunWithTran(fnc: (result: any) => void): Promise<any /* Repository */> {
        return await this._DataStore.RunWithTransaction(async (result: any) => {
            return await fnc(result);
        });
    }
}
/*
/**
 * 抽出条件に見合うデータが存在しない場合のエラー
 * /
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
 * /
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
 * /
export class PatchSpecifyKeys {
    public readonly uuid!: string;
    public readonly revision!: number;
    constructor(uuid: string, revision: number) {
        this.uuid = uuid;
        this.revision = revision;
    }
}
*/
