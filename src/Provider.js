import QueryableToSqlFactory from "./factory/QueryableToSqlFactory";

export default class Provider {
    constructor({
        db
    }) {
        if (db == null) {
            throw new Error("Null Exception: db cannot be null.");
        }

        this.db = db;
    }

    allAsync(sql, values){
        return new Promise((resolve, reject)=>{
            return this.db.all(sql, values, (error, result)=>{
                if (error != null){
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    runAsync(sql, values){
        return new Promise((resolve, reject)=>{
            return this.db.run(sql, values, (error, result)=>{
                if (error != null){
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    executeAsync(queryable) {
        const queryableToSqlFactory = new QueryableToSqlFactory({ queryable });
        const { sql } = queryableToSqlFactory.createWhereStatement();

        return this.allAsync(sql);
    };

    getCountAsync(queryable) {
        const queryableToSqlFactory = new QueryableToSqlFactory({ queryable });
        const { sql } = queryableToSqlFactory.createCountStatement();

        return this.allAsync(sql).then((results) => {
            return results[0]["count(*)"];
        });

    }

    removeAsync(queryable) {
        const queryableToSqlFactory = new QueryableToSqlFactory({ queryable });
        const { sql } = queryableToSqlFactory.createDeleteStatement();

        return this.allAsync(sql);
    }

    updateAsync(queryable, entity) {
        const queryableToSqlFactory = new QueryableToSqlFactory({ queryable });
        const statement = queryableToSqlFactory.createUpdateStatement(entity);

        return this.runAsync(statement.sql, statement.values);

    }


}