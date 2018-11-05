import SqliteUtils from "../utils/SqliteUtils";

export default class InsertStatementCreator {
    constructor({
        entity,
        tableName,
        primaryKeys
    }) {
        this.entity = entity;
        this.tableName = tableName;
        this.primaryKeys = primaryKeys;
    }

    static createStatement(options){
        const insertStatementCreator = new InsertStatementCreator(options);
        return insertStatementCreator.createStatement(); 
    }

    createStatement() {
        const entity = this.entity;
        const keys = Object.keys(entity);
        const values = keys.map((key) => {
            return entity[key];
        });
        const escapedKeys = keys.map((key) => {
            return SqliteUtils.escapeName(key);
        });

        const placeHolderArray = new Array(keys.length).fill("?").join(", ");

        return {
            sql: `INSERT INTO ${SqliteUtils.escapeName(this.tableName)} ( ${escapedKeys.join(", ")} ) VALUES ( ${placeHolderArray} )`,
            values: values
        }

    }
}