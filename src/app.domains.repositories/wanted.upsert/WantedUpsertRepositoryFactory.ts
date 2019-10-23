import IWantedUpsertRepository from "./I.Wanted.Upsert.Repository";
import { WantedUpsertRepository } from "./Wanted.Upsert.Repository";
import { AbsRepositoryFactory } from "../Abs.Repository.Factory";
import DataStore from "../../app.infras/infra.datastores/DataStore";

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