import DataStore from "../datastore";

/**
 * メソッドデコレータ。
 * データストアを初期化する。
 * @param schemas 
 */
export const InitDataStore = (/*schemas: any[]*/) => {
   
    return (target: any, property: string, descriptor: PropertyDescriptor) => {
        
        const method = descriptor.value;
        descriptor.value = async function (...args: any[]) {

            // データストア初期化
            let dataStore = args.find(x => x instanceof DataStore)!;
            // await dataStore.Init(schemas);
            await dataStore.CreateRunner();

            return await method.apply(descriptor, arguments);
        }
    }
}
