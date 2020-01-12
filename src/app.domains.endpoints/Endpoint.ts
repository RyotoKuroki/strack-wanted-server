import DataStore from "../app.infras/datastores/datastore.mysql";

/**
 * クラス用デコレータ。
 * 仕掛けると、_DataStore フィールドに、DataStore のインスタンスを自動生成します。
 * そのため、_DataStore フィールドがない場合は使用しないで下さい。
 * @param constructor 
 */
export const UseDataStore = <T extends {new(...args:any[]): {}}> (constructor: T) => {
    return class extends constructor {
        _DataStore = new DataStore();
    }
}

export default abstract class Endpoint {

    /** Decorator で自動生成 */
    protected _DataStore!: DataStore;

    protected _Request: any;
    protected _Response: any;

    constructor (req: any, res: any) {
        this._Request = req;
        this._Response = res;
    }

    public async ExecuteTemplateMethod (dto: any): Promise<void> {
        try {
            const params = this.GetParams(dto);

            const mainResult = await this.MainMethod(this._DataStore, params);

            await this.OnSuccess(mainResult);

        } catch (e) {
            //throw e;
            console.log(`@error in ExecTempMethod : ${e.message}`);
            await this.OnFail(e);
        }
    }
    
    /** リクエストパラメータを抽出 */
    abstract GetParams (dto: any): any;
    /** メイン処理 */
    abstract async MainMethod (dataStore: DataStore, params: any): Promise<any>;
    /** 正常終了処理処理 */
    abstract async OnSuccess (result: any): Promise<void>;
    /** 異常終了処理処理 */
    abstract async OnFail (error: any): Promise<void>;
}
