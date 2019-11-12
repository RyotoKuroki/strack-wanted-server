import { WantedDeleteRepository } from "./wanted.delete.repository";
import { AbsRepositoryFactory } from "../Abs.repository.factory";
import DataStore from "../../app.infras/datastores/datastore.mysql";

export class WantedDeleteRepositoryFactory extends AbsRepositoryFactory<WantedDeleteRepository> {

    public /* override */ async CreateRepository(): Promise<any/* Repository */> {
        return await new WantedDeleteRepository();
    }
    public /* override */ async CreateDataStore(repo: WantedDeleteRepository): Promise<DataStore> {
        return await repo.CreateDataStore();
    }
    public /* override */ async CreateNestedRepository(repo: WantedDeleteRepository, datastore: DataStore): Promise<any/* Repository */> {
        return await repo.CreateNestedRepository(datastore);
    }
}
