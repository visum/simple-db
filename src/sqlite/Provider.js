import SelectStatementCreator from "./statements/SelectStatementCreator";
import Sqlite3Wrapper from "./Sqlite3Wrapper";
import CountStatementCreator from "./statements/CountStatementCreator";
import DeleteWhereStatementCreator from "./statements/DeleteWhereStatementCreator";
import UpdateWhereStatementCreator from "./statements/UpdateWhereStatementCreator";

const defaultRefineQueryable = queryable => queryable;

export default class Provider {
    constructor({
        database,
        refineQueryable
    }) {
        if (database == null) {
            throw new Error("Null Exception: database cannot be null.");
        }

        if (typeof refineQueryable !== "function") {
            refineQueryable = defaultRefineQueryable;
        }

        this.database = database;
        this.sqliteDatabaseWrapper = new Sqlite3Wrapper(this.database);
        this.refineQueryable = refineQueryable;
    }

    _safelyRefineQueryable(queryable) {
        try {
            return queryable = this.refineQueryable(queryable);
        } catch (error) {
            //Swallow Error
        }
        return queryable;
    }

    toArrayAsync(queryable) {
        queryable = this._safelyRefineQueryable(queryable);
        const { sql } = SelectStatementCreator.createStatement(queryable);
        return this.sqliteDatabaseWrapper.allAsync(sql);
    }

    getFirstAsync(queryable) {
        return this.toArrayAsync(queryable).then((results) => {
            return results[0] || null
        });
    }

    getCountAsync(queryable) {
        queryable = this._safelyRefineQueryable(queryable);

        const { sql } = CountStatementCreator.createStatement(queryable);

        return this.sqliteDatabaseWrapper.allAsync(sql).then((results) => {
            return results[0]["count(*)"];
        });
    }

    getSqlAndValues(queryable) {
        queryable = this._safelyRefineQueryable(queryable);

        return SelectStatementCreator.createStatement(queryable);
    }

    removeAsync(queryable) {
        queryable = this._safelyRefineQueryable(queryable);

        const { sql } = DeleteWhereStatementCreator.createStatement(queryable);

        return this.sqliteDatabaseWrapper.allAsync(sql);
    }

    updateAsync(queryable, updates) {
        queryable = this._safelyRefineQueryable(queryable);

        const { sql, values } = UpdateWhereStatementCreator.createStatement(queryable, updates);

        return this.sqliteDatabaseWrapper.runAsync(sql, values);
    }


}