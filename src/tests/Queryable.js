import * as assert from "assert";
import sqlite from "sqlite3";
import Table from "../sqlite/Table";
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

exports["Queryable: toArrayAsync."] = async () => {
    const database = new sqlite.Database(":memory:");

    try {
        await createDatabaseAsync(database);

        const table = new Table({
            database,
            schema: testSchema
        });

        await fillDatabaseAsync(table);

        let results = await table.where()
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

        assert.equal(results.length, 2);

        await table.where()
            .column("firstName")
            .contains("John")
            .removeAsync();

        results = await table.where().toArrayAsync();
        assert.equal(results.length, 0);
    } catch (error) {
        throw error;
    } finally {
        database.close();
    }

};

exports["Queryable: IsIn with Queryable."] = async () => {
    const database = new sqlite.Database(":memory:");

    try {
        await createDatabaseAsync(database);

        const table = new Table({
            database,
            schema: testSchema
        });

        await fillDatabaseAsync(table);
        
        const results = await table.where()
            .column("firstName")
            .isIn(table.where().select({ "firstName": "firstName" }).take(1))
            .toArrayAsync();

        assert.equal(results.length, 1);

    } catch (error) {
        throw error;
    } finally {
        database.close();
    }

};

exports["Queryable: IsIn with Array."] = async () => {
    const database = new sqlite.Database(":memory:");

    try {
        await createDatabaseAsync(database);

        const table = new Table({
            database,
            schema: testSchema
        });

        await fillDatabaseAsync(table);

        const results = await table.where()
            .column("firstName")
            .isIn([`John_1_`])
            .toArrayAsync();

        assert.equal(results.length, 1);

    } catch (error) {
        throw error;
    } finally {
        database.close();
    }

};

exports["Queryable: getFirstAsync"] = async () => {
    const database = new sqlite.Database(":memory:");

    try {
        await createDatabaseAsync(database);

        const table = new Table({
            database,
            schema: testSchema
        });

        await fillDatabaseAsync(table);

        const result = await table.where()
            .column("firstName")
            .endsWith("_1_")
            .getFirstAsync();

        assert.equal(result != null, true);

    } catch (error) {
        throw error;
    } finally {
        database.close();
    }

};

exports["Queryable: removeAsync"] = async () => {
    const database = new sqlite.Database(":memory:");
    try {
        await createDatabaseAsync(database);

        const table = new Table({
            database,
            schema: testSchema
        });

        await fillDatabaseAsync(table);

        await table.where()
            .column("firstName")
            .contains("John")
            .removeAsync();
        const results = await table.where().toArrayAsync();

        assert.equal(results.length, 0);

    } catch (error) {
        throw error;
    } finally {
        database.close();
    }
};

exports["Queryable: updateAsync"] = async () => {
    const database = new sqlite.Database(":memory:");
    try {
        await createDatabaseAsync(database);

        const table = new Table({
            database,
            schema: testSchema
        });

        await fillDatabaseAsync(table);
        await table.where()
            .column("firstName")
            .endsWith("hn_1_")
            .updateAsync({
                firstName: "Jane"
            });

        const results = await table.where()
            .column("firstName")
            .endsWith("Jane")
            .toArrayAsync();

        assert.equal(results[0].firstName, "Jane");

    } catch (error) {
        throw error;
    } finally {
        database.close();
    }
};

exports["Queryable: getCountAsync"] = async () => {
    const database = new sqlite.Database(":memory:");

    try {
        await createDatabaseAsync(database);

        const table = new Table({
            database,
            schema: testSchema
        });

        await fillDatabaseAsync(table);

        const count = await table.where()
            .column("firstName")
            .contains("John")
            .getCountAsync();

        assert.equal(count, 300);

    } catch (error) {
        throw error;
    } finally {
        database.close();
    }
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
