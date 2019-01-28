import SelectStatementCreator from "./statements/SelectStatementCreator";
import Sqlite3Wrapper from "./Sqlite3Wrapper";
import CountStatementCreator from "./statements/CountStatementCreator";
import DeleteWhereStatementCreator from "./statements/DeleteWhereStatementCreator";
import UpdateWhereStatementCreator from "./statements/UpdateWhereStatementCreator";

export default class Provider {
    constructor({
        database
    }) {
        if (database == null) {
            throw new Error("Null Exception: database cannot be null.");
        }

        this.database = database;
        this.sqliteDatabaseWrapper = new Sqlite3Wrapper(this.database);
    }

    toArrayAsync(queryable) {
        const { sql } = SelectStatementCreator.createStatement(queryable);
        return this.sqliteDatabaseWrapper.allAsync(sql);
    }

    getFirstAsync(queryable) {
        return this.toArrayAsync(queryable).then((results) => {
            return results[0] || null
        });
    }

    getCountAsync(queryable) {
        const { sql } = CountStatementCreator.createStatement(queryable);

        return this.sqliteDatabaseWrapper.allAsync(sql).then((results) => {
            return results[0]["count(*)"];
        });

    }

    getSqlAndValues(queryable) {
        return CountStatementCreator.createStatement(queryable);
    }

    removeAsync(queryable) {
        const { sql } = DeleteWhereStatementCreator.createStatement(queryable);

        return this.sqliteDatabaseWrapper.allAsync(sql);
    }

    updateAsync(queryable, updates) {
        const { sql, values } = UpdateWhereStatementCreator.createStatement(queryable, updates);

        return this.sqliteDatabaseWrapper.runAsync(sql, values);
    }


}