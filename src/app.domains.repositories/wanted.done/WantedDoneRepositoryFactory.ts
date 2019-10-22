import IWantedDoneRepository from "./I.Wanted.Done.Repository";
import { WantedDoneRepository } from "./Wanted.Done.Repository";
import { AbsRepositoryFactory } from "../Abs.Repository.Factory";
import DataStore from "../../app.infras/infra.datastores/DataStore";

export class WantedDoneRepositoryFactory extends AbsRepositoryFactory<WantedDoneRepository> {
/*
    public /* override * / async SetupCompletely(): Promise<any> {
/*
        // create main repository.
        let repo = await this.CreateRepository();
        // init datastore
        let datastore = await this.CreateDataStore(repo);
        // init nested repositories & init datastore to nestedrepositories.
        repo = await this.CreateNestedRepository(repo, datastore);
        // return
        return repo;
        * /
        return super.SetupCompletely();
    }
*/
    public /* override */ async CreateRepository(): Promise<any/* Repository */> {
        return await new WantedDoneRepository();
    }
    public /* override */ async CreateDataStore(repo: WantedDoneRepository): Promise<DataStore> {
        return await repo.CreateDataStore();
    }
    public /* override */ async CreateNestedRepository(repo: WantedDoneRepository, datastore: DataStore): Promise<any/* Repository */> {
        return await repo.CreateNestedRepository(datastore);
    }
}