import { WantedUpsertRepository } from "./wanted.upsert.repository";
import { AbsRepositoryFactory } from "../Abs.repository.factory";
import DataStore from "../../app.infras/datastores/datastore.mysql";

export class WantedUpsertRepositoryFactory extends AbsRepositoryFactory<WantedUpsertRepository> {

    public /* override */ async CreateRepository(): Promise<any/* Repository */> {
        return await new WantedUpsertRepository();
    }
    public /* override */ async CreateDataStore(repo: WantedUpsertRepository): Promise<DataStore> {
        return await repo.CreateDataStore();
    }
    public /* override */ async CreateNestedRepository(repo: WantedUpsertRepository, datastore: DataStore): Promise<any/* Repository */> {
        return await repo.CreateNestedRepository(datastore);
    }
}
