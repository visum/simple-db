import Sqlite3Wrapper from "./Sqlite3Wrapper";
import TableStatementCreator from "./statements/TableStatementCreator";

export default class TableCreator {
    constructor({
        database,
        schema
    }) {
        this.database = database;
        this.schema = schema;
        this.sqliteDatabaseWrapper = new Sqlite3Wrapper(database);
        this.schemaToSqliteFactory = new TableStatementCreator(schema);
    }

    static async createTableIfNotExistsAsync({ database, schema }) {
        const tableCreator = new TableCreator({
            database: database,
            schema
        });

        return await tableCreator.createTableIfNotExistsAsync();
    }

    static async createTablesIfNotExistsAsync({ database, schemas }) {
        const promises = schemas.map((schema) => {
            const tableCreator = new TableCreator({
                database: database,
                schema
            });

            return tableCreator.createTableIfNotExistsAsync();
        });

        return await Promise.all(promises);
    }

    static async dropTableIfExistsAsync({ database, schema }) {
        const tableCreator = new TableCreator({
            database: database,
            schema
        });

        return await tableCreator.dropTableIfExistsAsync();
    }

    static async dropTableIfExistsAsync({ database, schemas }) {

        const promises = schemas.map((schema) => {
            const tableCreator = new TableCreator({
                database: database,
                schema
            });

            return tableCreator.dropTableIfExistsAsync();
        });

        return await Promise.all(promises);
    }

    async createTableIfNotExistsAsync() {
        const {
            sql,
            values
        } = this.schemaToSqliteFactory.createTableStatement();

        return await this.sqliteDatabaseWrapper.runAsync(sql, values);
    }

    async dropTableIfExistsAsync() {
        const {
            sql,
            values
        } = this.schemaToSqliteFactory.createDropTableStatment();

        return await this.sqliteDatabaseWrapper.runAsync(sql, values);
    }
}