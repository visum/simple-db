import SqliteDatabase from "./SqliteDatabase";

export default class JsonSchemaToSqlite {
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