import Sqlite3Wrapper from "./Sqlite3Wrapper";
import TableStatementCreator from "./statements/TableStatementCreator";

export default class TableCreator {
    constructor({
        database,
        schema
    }){
        this.database = database;
        this.schema = schema;
        this.sqliteDatabaseWrapper = new Sqlite3Wrapper(database);
        this.schemaToSqliteFactory = new TableStatementCreator(schema);
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