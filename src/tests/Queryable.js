import * as assert from "assert";
import sqlite from "sqlite3";
import Repository from "../sqlite/Repository";
import testSchema from "../testSchemas/person";
import TableCreator from "../sqlite/TableCreator";
import Queryable from "../../lib/queryable/Queryable";

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
            firstName: `John_${x}_`
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
            .endsWith("ohn_1_")
            .or()
            .column("firstName")
            .startsWith("John_2_")
            .and()
            .column("firstName")
            .contains("John")
            .orderByDesc("id")
            .toArrayAsync();
    }).then((results) => {
        assert.equal(results.length, 2);

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
            .isIn(table.where().select({ "firstName": "firstName" }).take(1))
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
            .isIn([`John_1_`])
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
            .endsWith("_1_")
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
            .endsWith("hn_1_")
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

exports["Queryable: toJson"] = function () {
    const queryable = new Queryable({ query: { type: "person" } });
    const json = queryable.column("firstName").isEqualTo("Joe").toJson();

    assert.equal(json, `{"type":"person","expression":{"type":"isEqualTo","isComposite":true,"children":[{"type":"property","isComposite":true,"children":[{"type":"type","isComposite":false,"value":"person"},{"type":"propertyName","isComposite":false,"value":"firstName"}]},{"type":"string","isComposite":false,"value":"Joe"}]},"select":{},"limit":-1,"offset":0,"orderBy":[]}`);
};

exports["Queryable: fromJson"] = function () {
    const queryable = new Queryable({ query: { type: "person" } });
    const roleQueryable = new Queryable({ query: { type: "role" } }).column("name").isEqualTo("admin").select({ id: "id" });

    const json = queryable.column("firstName").isEqualTo("Joe").and().column("roleId").isIn(roleQueryable).toJson();

    const queryable2 = Queryable.fromJson(json);
    const json2 = queryable2.toJson();

    assert.equal(json, json2);
};
