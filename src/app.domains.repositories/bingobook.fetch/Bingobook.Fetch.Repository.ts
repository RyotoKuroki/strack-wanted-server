import $ from 'jquery';
import { AbsRepository } from '../Abs.Repository';
import IBingobookFetchRepository from './I.Bingobook.Fetch.Repository';
import DataStore from '../../app.infras/infra.datastores/DataStore';
import { TrWanted, PatchSpecifyKeys } from '../../app.entities/TrWanted';

export class BingobookFetchRepository extends AbsRepository implements IBingobookFetchRepository {

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // @@@@@@ override AbsWantedDoneRepository @@@@@@
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    /**
     * StoredWanted 情報のコピーを外部に提供する。
     * Wanted インスタンスを外部に直接晒さないのは、外部から不正な参照方法で編集されることを防ぐための対策。
     */
    public get StoredWanteds(): TrWanted[] {
        // TODO: エラー回避＆コメント解除
        // return $.extend(true, [], this._Wanteds);
        return this._Wanteds;
    }
    protected _Wanteds!: TrWanted[];

    /**
     * DB検索。
     * Wanted情報を特定して、１件取得
     * @param specifyKeys 
     */
    public /* override */ async StoreWanteds(whois: string): Promise<any> {
        this._Wanteds = await TrWanted.find({
            where: {
                whois: whois,
            }
        });
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
