import * as assert from "assert";
import sqlite from "sqlite3";
import Repository from "../sqlite/Repository";

const createDatabaseAsync = (database) => {
    return new Promise((resolve, reject) => {
        database.run(
            `CREATE TABLE IF NOT EXISTS test (
                id integer PRIMARY KEY,
                url text NOT NULL UNIQUE
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

const fillDatabaseAsync = (table) => {
    const tests = [];

    for (let x = 0; x < 300; x++) {
        const testsPromise = table.addAsync({
            url: `/api/${x}.xhtml`
        });
        tests.push(testsPromise);
    }

    return Promise.all(tests);

}

exports["Queryable: toArrayAsync."] = function () {
    const database = new sqlite.Database(":memory:");
    const createDatabasePromise = createDatabaseAsync(database);
    const table = new Repository({
        database,
        name: "test"
    });

    return createDatabasePromise.then(() => {
        return fillDatabaseAsync(table);
    }).then(() => {
        return table.where()
            .column("url")
            .endsWith("/1.xhtml")
            .or()
            .column("url")
            .startsWith("/api/2.x")
            .or()
            .column("url")
            .contains("/3.xhtm")
            .orderByDesc("id")
            .toArrayAsync();
    }).then((results) => {
        assert.equal(results.length, 3);

        return table.where()
            .column("url")
            .contains(".xhtml")
            .removeAsync();
    }).then(() => {
        return table.where().toArrayAsync();
    }).then((results) => {
        assert.equal(results.length, 0);
        database.close();
    }).catch((error) => {
        database.close();
        throw error;
    });

};

exports["Queryable: IsIn with Queryable."] = function () {
    const database = new sqlite.Database(":memory:");
    const createDatabasePromise = createDatabaseAsync(database);
    const table = new Repository({
        database,
        name: "test"
    });

    return createDatabasePromise.then(() => {
        return fillDatabaseAsync(table);
    }).then(() => {
        return table.where()
            .column("url")
            .isIn(table.where().select({"url": "url"}).take(1))
            .toArrayAsync();
    }).then((results) => {
        assert.equal(results.length, 1);
        database.close();
    }).catch((error) => {
        database.close();
        throw error;
    });

};

exports["Queryable: IsIn with Array."] = function () {
    const database = new sqlite.Database(":memory:");
    const createDatabasePromise = createDatabaseAsync(database);
    const table = new Repository({
        database,
        name: "test"
    });

    return createDatabasePromise.then(() => {
        return fillDatabaseAsync(table);
    }).then(() => {
        return table.where()
            .column("url")
            .isIn([`/api/1.xhtml`])
            .toArrayAsync();
    }).then((results) => {
        assert.equal(results.length, 1);
        database.close();
    }).catch((error) => {
        database.close();
        throw error;
    });

};

exports["Queryable: getFirstAsync"] = function () {
    const database = new sqlite.Database(":memory:");
    const createDatabasePromise = createDatabaseAsync(database);
    const table = new Repository({
        database,
        name: "test"
    });

    return createDatabasePromise.then(() => {
        return fillDatabaseAsync(table);
    }).then(() => {
        return table.where()
            .column("url")
            .endsWith("/1.xhtml")
            .getFirstAsync();
    }).then((result) => {
        assert.equal(result != null, true);
        database.close();
    }).catch((error) => {
        database.close();
        throw error;
    });

};

exports["Queryable: removeAsync"] = function () {
    const database = new sqlite.Database(":memory:");
    const createDatabasePromise = createDatabaseAsync(database);
    const table = new Repository({
        database,
        name: "test"
    });

    return createDatabasePromise.then(() => {
        return fillDatabaseAsync(table);
    }).then(() => {
        return table.where()
            .column("url")
            .contains(".xhtml")
            .removeAsync();
    }).then(() => {
        return table.where().toArrayAsync();
    }).then((results) => {
        assert.equal(results.length, 0);
        database.close();
    }).catch((error) => {
        database.close();
        throw error;
    });

};

exports["Queryable: updateAsync"] = function () {
    const database = new sqlite.Database(":memory:");
    const createDatabasePromise = createDatabaseAsync(database);
    const table = new Repository({
        database,
        name: "test"
    });

    return createDatabasePromise.then(() => {
        return fillDatabaseAsync(table);
    }).then(() => {
        return table.where()
            .column("url")
            .endsWith("/1.xhtml")
            .updateAsync({
                url: "New Value"
            });
    }).then(() => {
        return table.where()
            .column("url")
            .endsWith("New Value")
            .toArrayAsync();
    }).then((results) => {
        assert.equal(results[0].url, "New Value");
        database.close();
    }).catch((error) => {
        database.close();
        throw error;
    });

};

exports["Queryable: getCountAsync"] = function () {
    const database = new sqlite.Database(":memory:");
    const createDatabasePromise = createDatabaseAsync(database);
    const table = new Repository({
        database,
        name: "test"
    });

    return createDatabasePromise.then(() => {
        return fillDatabaseAsync(table);
    }).then(() => {
        return table.where()
            .column("url")
            .endsWith("xhtml")
            .getCountAsync()
    }).then((count) => {
        assert.equal(count, 300);
    }).catch((error) => {
        database.close();
        throw error;
    });

};
