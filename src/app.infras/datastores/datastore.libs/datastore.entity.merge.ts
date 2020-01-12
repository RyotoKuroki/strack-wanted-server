import { BaseEntity } from "typeorm";

export default class EntityMerge<T extends BaseEntity> {

    protected static Parser (value: any, typ: string) {
        return typ === 'string' ? value.toString()
            : typ === 'number' ? Number(value)
            : value;
    }
    /**
     * src -> dest へデータマージ。
     * マージ対象とする項目は fields で指定。
     */
    /*
    public static Entity2Entity<T> (src: T, dest: { [key: string]: any }, fields?: any[]) {
        if (!fields) {
            fields = new Array<any>();
            for (let proto in Object.getPrototypeOf(src)) {
                // const typ = typeof(proto);
                // console.log(`typ : ${typ}`);
                // if (typeof(proto) !== 'function')
                    fields.push(proto.toString());
            }
        }
        fields.forEach((field, index) =>
            dest[field] = EntityMerge.Parser(src[field], typeof(src[field])));
    }
    */

    /**
     * Undefined 以外のフィールドの値を置換え。
     * src に設定された要素数と fields の要素数を合わせる必要があります。
     */
    public static Array2Entity<T> (src: T[], dest: { [key: string]: any }, fields: any[]) {
        if (src.length !== fields.length)
            throw new Error(`エンティティ間のマージ失敗（array -> entity）\r\nsrc要素数とフィールド数を一致させて下さい。`);
        
        fields.forEach((field, index) =>
            dest[field] = EntityMerge.Parser(src[index], typeof(src[field])));
    }
}
