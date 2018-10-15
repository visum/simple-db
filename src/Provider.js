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

    executeAsync(queryable) {
        const queryableToSqlFactory = new QueryableToSqlFactory({ queryable });
        const {sql}  = queryableToSqlFactory.createWhereStatement();

        return new Promise((resolve, reject) => {
            this.db.all(sql, (err, results) => {
                if (err != null) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

    };

    getCountAsync(queryable) {
        const queryableToSqlFactory = new QueryableToSqlFactory({ queryable });
        const { sql } = queryableToSqlFactory.createCountStatement();

        return new Promise((resolve, reject) => {
            this.db.all(sql, (err, results) => {
                if (err != null) {
                    reject(err);
                } else {
                    resolve(results[0]["count(*)"]);
                }
            });
        });
    }

    removeAsync(queryable) {
        const queryableToSqlFactory = new QueryableToSqlFactory({ queryable });
        const { sql } = queryableToSqlFactory.createDeleteStatement();

        return new Promise((resolve, reject) => {
            this.db.run(sql, (err, result) => {
                if (err != null) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    updateAsync(queryable, entity) {
        const queryableToSqlFactory = new QueryableToSqlFactory({ queryable });
        const statement = queryableToSqlFactory.createUpdateStatement(entity);

        return new Promise((resolve, reject) => {
            this.db.run(
                statement.sql,
                statement.values,
                (err, result) => {
                    if (err != null) {
                        reject(err)
                    } else {
                        resolve(result);
                    }
                }
            );
        });

    }


}