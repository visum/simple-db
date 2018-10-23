import QueryableToSqlFactory from "./factory/QueryableToSqlFactory";
import SqliteDatabaseWrapper from "./SqliteDatabaseWrapperWrapper";

export default class Provider {
    constructor({
        database
    }) {
        if (database == null) {
            throw new Error("Null Exception: database cannot be null.");
        }

        this.database = database;
        this.sqliteDatabaseWrapper = new SqliteDatabaseWrapper(this.database);
    }

    toArrayAsync(queryable) {
        const queryableToSqlFactory = new QueryableToSqlFactory({ queryable });
        const { sql } = queryableToSqlFactory.createWhereStatement();

        return this.sqliteDatabaseWrapper.allAsync(sql);
    }

    getFirstAsync(queryable){
        return this.toArrayAsync(queryable).then((results)=>{
            return results[0] || null
        });
    }

    getCountAsync(queryable) {
        const queryableToSqlFactory = new QueryableToSqlFactory({ queryable });
        const { sql } = queryableToSqlFactory.createCountStatement();

        return this.sqliteDatabaseWrapper.allAsync(sql).then((results) => {
            return results[0]["count(*)"];
        });

    }

    removeAsync(queryable) {
        const queryableToSqlFactory = new QueryableToSqlFactory({ queryable });
        const { sql } = queryableToSqlFactory.createDeleteStatement();

        return this.sqliteDatabaseWrapper.allAsync(sql);
    }

    updateAsync(queryable, entity) {
        const queryableToSqlFactory = new QueryableToSqlFactory({ queryable });
        const statement = queryableToSqlFactory.createUpdateStatement(entity);

        return this.sqliteDatabaseWrapper.runAsync(statement.sql, statement.values);

    }


}