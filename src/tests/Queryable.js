import * as assert from "assert";
import sqlite from "sqlite3";
import Repository from "../sqlite/Repository";
import testSchema from "../testSchemas/person";
import TableCreator from "../sqlite/TableCreator";

const createDatabaseAsync = (database) => {
    return TableCreator.createTableIfNotExistsAsync({
        database, 
        schema: testSchema
    });
}

const fillDatabaseAsync = (table) => {
    const tests = [];

    for (let x = 0; x < 300; x++) {
        const testsPromise = table.addAsync({
            firstName: `John${x}`
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
        schema: testSchema
    });

    return createDatabasePromise.then(() => {
        return fillDatabaseAsync(table);
    }).then(() => {
        return table.where()
            .column("firstName")
            .endsWith("ohn1")
            .orderByDesc("id")
            .toArrayAsync();
    }).then((results) => {
        assert.equal(results.length, 1);

        return table.where()
            .column("firstName")
            .contains("John")
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
        schema: testSchema
    });

    return createDatabasePromise.then(() => {
        return fillDatabaseAsync(table);
    }).then(() => {
        return table.where()
            .column("firstName")
            .isIn(table.where().select({"firstName": "firstName"}).take(1))
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
        schema: testSchema
    });

    return createDatabasePromise.then(() => {
        return fillDatabaseAsync(table);
    }).then(() => {
        return table.where()
            .column("firstName")
            .isIn([`John1`])
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
        schema: testSchema
    });

    return createDatabasePromise.then(() => {
        return fillDatabaseAsync(table);
    }).then(() => {
        return table.where()
            .column("firstName")
            .endsWith("1")
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
        schema: testSchema
    });

    return createDatabasePromise.then(() => {
        return fillDatabaseAsync(table);
    }).then(() => {
        return table.where()
            .column("firstName")
            .contains("John")
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
        schema: testSchema
    });

    return createDatabasePromise.then(() => {
        return fillDatabaseAsync(table);
    }).then(() => {
        return table.where()
            .column("firstName")
            .endsWith("John1")
            .updateAsync({
                firstName: "Jane"
            });
    }).then(() => {
        return table.where()
            .column("firstName")
            .endsWith("Jane")
            .toArrayAsync();
    }).then((results) => {
        assert.equal(results[0].firstName, "Jane");
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
        schema: testSchema
    });

    return createDatabasePromise.then(() => {
        return fillDatabaseAsync(table);
    }).then(() => {
        return table.where()
            .column("firstName")
            .contains("John")
            .getCountAsync()
    }).then((count) => {
        assert.equal(count, 300);
    }).catch((error) => {
        database.close();
        throw error;
    });

};
