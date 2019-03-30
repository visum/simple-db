import * as assert from "assert";
import { Pool } from "pg";
import Table from "../../postgresql/Table";
import testSchema from "./testSchemas/person";
import TableCreator from "../../postgresql/TableCreator";
import Queryable from "../../../lib/queryable/Queryable";

const pool = new Pool({
    host: "localhost",
    user: "test_user",
    password: "test_user_pass",
    database: "tests",
    port: 5432
  });

const createDatabaseAsync = () => {
    return TableCreator.createTableIfNotExistsAsync({
        database: pool,
        schema: testSchema
    });
}

const dropTableAsync = () => {
    return TableCreator.dropTableIfExistsAsync({
        database: pool,
        schema: testSchema
    });
};

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

    try {
        await createDatabaseAsync();

        const table = new Table({
            database: pool,
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
        await dropTableAsync();
    }

};

exports["Queryable: IsIn with Queryable."] = async () => {
    try {
        await createDatabaseAsync();

        const table = new Table({
            database: pool,
            schema: testSchema
        });

        await fillDatabaseAsync(table);

        const isInExpression = table.where().select({ "firstName": "firstName" }).take(1);
        
        const results = await table.where()
            .column("firstName")
            .isIn(isInExpression)
            .toArrayAsync();

        assert.equal(results.length, 1);

    } catch (error) {
        throw error;
    } finally {
        await dropTableAsync();
    }

};

exports["Queryable: IsIn with Array."] = async () => {
    try {
        await createDatabaseAsync();

        const table = new Table({
            database: pool,
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
        await dropTableAsync();
    }

};

exports["Queryable: getFirstAsync"] = async () => {
    try {
        await createDatabaseAsync();

        const table = new Table({
            database: pool,
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
        await dropTableAsync();
    }

};

exports["Queryable: removeAsync"] = async () => {
    try {
        await createDatabaseAsync();

        const table = new Table({
            database: pool,
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
        await dropTableAsync();
    }
};

exports["Queryable: updateAsync"] = async () => {
    try {
        await createDatabaseAsync();

        const table = new Table({
            database: pool,
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
        await dropTableAsync();
    }
};

exports["Queryable: getCountAsync"] = async () => {
    try {
        await createDatabaseAsync();

        const table = new Table({
            database: pool,
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
        await dropTableAsync();
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
