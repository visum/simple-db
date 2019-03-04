import SelectStatementCreator from "./statements/SelectStatementCreator";
import Sqlite3Wrapper from "./Sqlite3Wrapper";
import CountStatementCreator from "./statements/CountStatementCreator";
import DeleteWhereStatementCreator from "./statements/DeleteWhereStatementCreator";
import UpdateWhereStatementCreator from "./statements/UpdateWhereStatementCreator";
import Queryable from "../../lib/queryable/Queryable";

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
            const alteredQueryable = this.refineQueryable(queryable);

            if (!(alteredQueryable instanceof Queryable)) {
                throw new Error("Expected to have a queryable returned on refine Queryable.");
            }

            return alteredQueryable;
        } catch (error) {
            throw error;
        }
    }

    async toArrayAsync(queryable) {
        queryable = this._safelyRefineQueryable(queryable);
        const { sql } = SelectStatementCreator.createStatement(queryable);
        return await this.sqliteDatabaseWrapper.allAsync(sql);
    }

    async getFirstAsync(queryable) {
        const results = await this.toArrayAsync(queryable);
        return results[0] || null
    }

    async getCountAsync(queryable) {
        queryable = this._safelyRefineQueryable(queryable);

        const { sql } = CountStatementCreator.createStatement(queryable);
        const results = await this.sqliteDatabaseWrapper.allAsync(sql);

        return results[0]["count(*)"];
    }

    getSqlAndValues(queryable) {
        queryable = this._safelyRefineQueryable(queryable);

        return SelectStatementCreator.createStatement(queryable);
    }

    async removeAsync(queryable) {
        queryable = this._safelyRefineQueryable(queryable);

        const { sql } = DeleteWhereStatementCreator.createStatement(queryable);

        return await this.sqliteDatabaseWrapper.allAsync(sql);
    }

    async updateAsync(queryable, updates) {
        queryable = this._safelyRefineQueryable(queryable);

        const { sql, values } = UpdateWhereStatementCreator.createStatement(queryable, updates);

        return await this.sqliteDatabaseWrapper.runAsync(sql, values);
    }


}