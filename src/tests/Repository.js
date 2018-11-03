import * as assert from "assert";
import sqlite from "sqlite3";
import Repository from "../sqlite/Repository";

const createDatabaseAsync = (database) => {
    return new Promise((resolve, reject) => {
        database.run(
            `CREATE TABLE IF NOT EXISTS test (
                id integer PRIMARY KEY,
                data text NOT NULL UNIQUE
            )`,
            (error) => {
                if (error != null) {
                    reject(error);
                } else {
                    resolve();
                }
            }
        );
    });
}

exports["Repository: addAsync"] = function () {
    const database = new sqlite.Database(":memory:");
    const repository = new Repository({
        database,
        name: "test"
    });

    return createDatabaseAsync(database).then(() => {
        return repository.addAsync({ data: "blah" });
    }).then(() => {
        database.close();
    }).catch((error) => {
        database.close();
        throw error;
    })
};

exports["Repository: updateAsync"] = function () {
    const database = new sqlite.Database(":memory:");
    const repository = new Repository({
        database,
        name: "test"
    });

    return createDatabaseAsync(database).then(() => {
        return repository.addAsync({ data: "blah" });
    }).then(({ lastID: id }) => {
        return repository.updateAsync({
            id: id,
            data: "blah2"
        });
    }).then(() => {
        return repository.where().column("data").isEqualTo("blah2").toArrayAsync();
    }).then((results) => {
        assert.equal(results.length, 1);
        database.close();
    }).catch((error) => {
        database.close();
        throw error;
    })
};

exports["Repository: removeAsync"] = function () {
    const database = new sqlite.Database(":memory:");
    const repository = new Repository({
        database,
        name: "test"
    });

    return createDatabaseAsync(database).then(() => {
        return repository.addAsync({ data: "blah" });
    }).then(({ lastID: id }) => {
        return repository.removeAsync({
            id: id
        });
    }).then(() => {
        return repository.where().column("data").isEqualTo("blah").toArrayAsync();
    }).then((results) => {
        assert.equal(results.length, 0);
        database.close();
    }).catch((error) => {
        database.close();
        throw error;
    })
};
