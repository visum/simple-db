import SqliteDatabase from "./SqliteDatabase";
import SchemaToSqliteFactory from "./factory/SchemaToSqliteFactory";

export default class SchemaToSqlite {
    constructor({
        database,
        schema
    }){
        this.database = database;
        this.schema = schema;
        this.sqliteDatabase = new SqliteDatabase(database);
        this.schemaToSqliteFactory = new SchemaToSqliteFactory(schema);
    }

    createRepositoryIfNotExistsAsync(){
        const {
            sql,
            values
        } = this.schemaToSqliteFactory.createTableStatement();

        return this.sqliteDatabase.runAsync(sql, values);
    }

    dropRepositoryIfExistsAsync(){
        const {
            sql,
            values
        } = this.schemaToSqliteFactory.createDropTableStatment();

        return this.sqliteDatabase.runAsync(sql, values);
    
    }
}