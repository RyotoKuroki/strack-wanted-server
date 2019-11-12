import { WantedFetchRepository } from "./wanted.fetch.repository";
import { AbsRepositoryFactory } from "../Abs.repository.factory";
import DataStore from "../../app.infras/datastores/datastore.mysql";

export class WantedFetchRepositoryFactory extends AbsRepositoryFactory<WantedFetchRepository> {

    public /* override */ async CreateRepository(): Promise<any/* Repository */> {
        return await new WantedFetchRepository();
    }
    public /* override */ async CreateDataStore(repo: WantedFetchRepository): Promise<DataStore> {
        return await repo.CreateDataStore();
    }
    public /* override */ async CreateNestedRepository(repo: WantedFetchRepository, datastore: DataStore): Promise<any/* Repository */> {
        return await repo.CreateNestedRepository(datastore);
    }
}
