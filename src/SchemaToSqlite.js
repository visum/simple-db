import SqliteDatabase from "./SqliteDatabase";

export default class SchemaToSqlite {
    constructor({
        database,
        schema
    }){
        this.database = database;
        this.schema = schema;
        this.sqliteDatabase = new SqliteDatabase(database);
    }

    createTableIfNotExists(){
        
    }
}