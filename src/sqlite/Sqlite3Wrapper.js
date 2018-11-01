export default class Sqlite3Wrapper {
    constructor(database) {
        this.database = database;
    }

    runAsync(sql, values = []) {
        return new Promise((resolve, reject) => {
            return this.database.run(sql, values, function (error) {
                if (error != null) {
                    reject(error);
                } else {
                    resolve(this);
                }
            });
        });
    }

    allAsync(sql, values = []) {
        return new Promise((resolve, reject) => {
            return this.database.all(sql, values, (error, result) => {
                if (error != null) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

}   