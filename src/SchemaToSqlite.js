import SqliteDatabaseWrapper from "./SqliteDatabaseWrapperWrapper";
import SchemaToSqliteFactory from "./factory/SchemaToSqliteFactory";

export default class SchemaToSqlite {
    constructor({
        database,
        schema
    }){
        this.database = database;
        this.schema = schema;
        this.sqliteDatabaseWrapper = new SqliteDatabaseWrapper(database);
        this.schemaToSqliteFactory = new SchemaToSqliteFactory(schema);
    }

    createRepositoryIfNotExistsAsync(){
        const {
            sql,
            values
        } = this.schemaToSqliteFactory.createTableStatement();

        return this.sqliteDatabaseWrapper.runAsync(sql, values);
    }

    dropRepositoryIfExistsAsync(){
        const {
            sql,
            values
        } = this.schemaToSqliteFactory.createDropTableStatment();

        return this.sqliteDatabaseWrapper.runAsync(sql, values);
    
    }
}