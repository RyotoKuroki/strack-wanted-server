import IWantedDeleteRepository from "./I.Wanted.Delete.Repository";
import { WantedDeleteRepository } from "./Wanted.Delete.Repository";
import { AbsRepositoryFactory } from "../Abs.Repository.Factory";
import DataStore from "../../app.infras/infra.datastores/DataStore";

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
