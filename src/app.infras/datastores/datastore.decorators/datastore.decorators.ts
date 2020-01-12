import DataStore from "../datastore.mysql";

/**
 * メソッドデコレータ。
 * データストアを初期化する。
 * @param schemas 
 */
export const InitDataStore = (schemas: any[]) => {
   
    return (target: any, property: string, descriptor: PropertyDescriptor) => {
        
        const method = descriptor.value;
        descriptor.value = async function (...args: any[]) {

            // データストア初期化
            // このデコレータはトランザクション処理の想定のため、dataStore は必ず取得出来る想定としておく（取得出来ない場合は例外でいいし）。
            let dataStore = args.find(x => x instanceof DataStore)!;
            await dataStore.Init(schemas);

            return await method.apply(descriptor, arguments);
        }
    }
}
