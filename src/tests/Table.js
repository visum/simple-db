
import * as assert from "assert";
import sqlite from "sqlite3";
import Table from "../sqlite/Table";
import personSchema from "../testSchemas/person";
import TableCreator from "../sqlite/TableCreator";

exports["Table: addAsync"] = function () {
    const database = new sqlite.Database(":memory:");
    const table = new Table({
        database,
        schema: personSchema
    });

    return TableCreator.createTableIfNotExistsAsync({
        database,
        schema: personSchema
    }).then(() => {
        return table.addAsync({ firstName: "John" });
    }).then(() => {
        database.close();
    }).catch((error) => {
        database.close();
        throw error;
    })
};

exports["Table: updateAsync"] = function () {
    const database = new sqlite.Database(":memory:");
    const table = new Table({
        database,
        schema: personSchema
    });

    return TableCreator.createTableIfNotExistsAsync({
        database,
        schema: personSchema
    }).then(() => {
        return table.addAsync({ firstName: "John" });
    }).then(({ lastID: id }) => {
        return table.updateAsync({
            id: id,
            firstName: "Jane"
        });
    }).then(() => {
        return table.where().column("firstName").isEqualTo("Jane").toArrayAsync();
    }).then((results) => {
        assert.equal(results.length, 1);
        database.close();
    }).catch((error) => {
        database.close();
        throw error;
    })
};

exports["Table: removeAsync"] = function () {
    const database = new sqlite.Database(":memory:");
    const table = new Table({
        database,
        schema: personSchema
    });

    return TableCreator.createTableIfNotExistsAsync({
        database,
        schema: personSchema
    }).then(() => {
        return table.addAsync({ firstName: "John" });
    }).then(({ lastID: id }) => {
        return table.removeAsync({
            id: id
        });
    }).then(() => {
        return table.where().column("firstName").isEqualTo("John").toArrayAsync();
    }).then((results) => {
        assert.equal(results.length, 0);
        database.close();
    }).catch((error) => {
        database.close();
        throw error;
    })
};
