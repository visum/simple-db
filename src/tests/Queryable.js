import * as assert from "assert";
import sqlite from "sqlite3";
import Repository from "../Repository";

const createDatabaseAsync = (db) => {
    return new Promise((resolve, reject) => {
        db.run(
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
            url: `//api/${x}.xhtml`
        });
        tests.push(testsPromise);
    }

    return Promise.all(tests);

}

exports["Queryable"] = function () {
    const db = new sqlite.Database(":memory:");
    const createDatabasePromise = createDatabaseAsync(db);
    const table = new Repository({
        db,
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
            .startsWith("//api/2.x")
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
        db.close();
    }).catch(() => {
        db.close();
    });

};

exports["Queryable: removeAsync"] = function () {
    const db = new sqlite.Database(":memory:");
    const createDatabasePromise = createDatabaseAsync(db);
    const table = new Repository({
        db,
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
        db.close();
    }).catch(() => {
        db.close();
    });

};

exports["Queryable: updateAsync"] = function () {
    const db = new sqlite.Database(":memory:");
    const createDatabasePromise = createDatabaseAsync(db);
    const table = new Repository({
        db,
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
        db.close();
    }).catch((error) => {
        db.close();
        throw error;
    });

};

exports["Queryable: getCountAsync"] = function () {
    const db = new sqlite.Database(":memory:");
    const createDatabasePromise = createDatabaseAsync(db);
    const table = new Repository({
        db,
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
        db.close();
        throw error;
    });

};
