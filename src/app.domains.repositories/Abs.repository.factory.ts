import { AbsRepository } from "./Abs.repository";
import DataStore from "../app.infras/infra.datastores/datastore";

export abstract class AbsRepositoryFactory<T extends AbsRepository> {
    
    /**
     * todo: static
     * 
     * リポジトリの生成、データストアの生成、ネストリポジトリが必要な場合はその生成　など、
     * 必要な処理を一手に行うための代表メソッド。
     * サービスは、このメソッドを実行する。
     */
    public async SetupCompletely(): Promise<T> {

        // create main repository.
        let repo = await this.CreateRepository();
        // init datastore
        let datastore = await this.CreateDataStore(repo);
        // init nested repositories & init datastore to nestedrepositories.
        repo = await this.CreateNestedRepository(repo, datastore);
        // return
        return repo;
    }

    /**
     * リポジトリ生成
     */
    public abstract CreateRepository(): Promise<T>;
    /**
     * リポジトリが使うデータストア生成
     * @param repo 
     */
    public abstract CreateDataStore(repo: T): Promise<DataStore>;
    /**
     * ネストリポジトリが必要な場合、このメソッド内で生成する。
     * データソースも渡す（トランザクションに対応するため）。
     * @param repo 
     * @param datastore 
     */
    public abstract CreateNestedRepository(repo: T, datastore: DataStore): Promise<T>;
}