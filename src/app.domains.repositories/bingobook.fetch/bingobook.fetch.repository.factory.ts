import { BingobookFetchRepository } from "./bingobook.fetch.repository";
import { AbsRepositoryFactory } from "../Abs.repository.factory";
import DataStore from "../../app.infras/infra.datastores/datastore";

export class BingobookFetchRepositoryFactory extends AbsRepositoryFactory<BingobookFetchRepository> {

    public /* override */ async CreateRepository(): Promise<any/* Repository */> {
        return await new BingobookFetchRepository();
    }
    public /* override */ async CreateDataStore(repo: BingobookFetchRepository): Promise<DataStore> {
        return await repo.CreateDataStore();
    }
    public /* override */ async CreateNestedRepository(repo: BingobookFetchRepository, datastore: DataStore): Promise<any/* Repository */> {
        return await repo.CreateNestedRepository(datastore);
    }
}
