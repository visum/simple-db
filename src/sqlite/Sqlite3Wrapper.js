export default class Sqlite3Wrapper {
    constructor(database) {
        this.database = database;
    }

   async runAsync(sql, values = []) {
        return await new Promise((resolve, reject) => {
            return this.database.run(sql, values, function (error) {
                if (error != null) {
                    reject(error);
                } else {
                    resolve(this);
                }
            });
        });
    }

    async allAsync(sql, values = []) {
        return await new Promise((resolve, reject) => {
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