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

    static createTableIfNotExistsAsync({ database, schema }) {
        const tableCreator = new TableCreator({
            database: database,
            schema
        });

        return tableCreator.createTableIfNotExistsAsync();
    }

    static createTablesIfNotExistsAsync({ database, schemas }) {
        const promises = schemas.map((schema) => {
            const tableCreator = new TableCreator({
                database: database,
                schema
            });

            return tableCreator.createTableIfNotExistsAsync();
        });

        return Promise.all(promises);
    }

    static dropTableIfExistsAsync({ database, schema }) {
        const tableCreator = new TableCreator({
            database: database,
            schema
        });

        return tableCreator.dropTableIfExistsAsync();
    }

    static dropTableIfExistsAsync({ database, schemas }) {

        const promises = schemas.map((schema) => {
            const tableCreator = new TableCreator({
                database: database,
                schema
            });

            return tableCreator.dropTableIfExistsAsync();
        });

        return Promise.all(promises);

    }

    createTableIfNotExistsAsync() {
        const {
            sql,
            values
        } = this.schemaToSqliteFactory.createTableStatement();

        return this.sqliteDatabaseWrapper.runAsync(sql, values);
    }

    dropTableIfExistsAsync() {
        const {
            sql,
            values
        } = this.schemaToSqliteFactory.createDropTableStatment();

        return this.sqliteDatabaseWrapper.runAsync(sql, values);

    }
}