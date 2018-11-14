import * as assert from "assert";
import sqlite from "sqlite3";
import Repository from "../sqlite/Repository";
import personSchema from "../testSchemas/person";
import TableCreator from "../sqlite/TableCreator";

exports["Repository: addAsync"] = function () {
    const database = new sqlite.Database(":memory:");
    const repository = new Repository({
        database,
        schema: personSchema
    });

    return TableCreator.createTableIfNotExistsAsync({
        database,
        schema: personSchema
    }).then(() => {
        return repository.addAsync({ firstName: "John" });
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
        schema: personSchema
    });

    return TableCreator.createTableIfNotExistsAsync({
        database,
        schema: personSchema
    }).then(() => {
        return repository.addAsync({ firstName: "John" });
    }).then(({ lastID: id }) => {
        return repository.updateAsync({
            id: id,
            firstName: "Jane"
        });
    }).then(() => {
        return repository.where().column("firstName").isEqualTo("Jane").toArrayAsync();
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
        schema: personSchema
    });

    return TableCreator.createTableIfNotExistsAsync({
        database,
        schema: personSchema
    }).then(() => {
        return repository.addAsync({ firstName: "John" });
    }).then(({ lastID: id }) => {
        return repository.removeAsync({
            id: id
        });
    }).then(() => {
        return repository.where().column("firstName").isEqualTo("John").toArrayAsync();
    }).then((results) => {
        assert.equal(results.length, 0);
        database.close();
    }).catch((error) => {
        database.close();
        throw error;
    })
};
