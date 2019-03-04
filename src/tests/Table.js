
import * as assert from "assert";
import sqlite from "sqlite3";
import Table from "../sqlite/Table";
import personSchema from "../testSchemas/person";
import TableCreator from "../sqlite/TableCreator";

exports["Table: addAsync"] = async () => {
    const database = new sqlite.Database(":memory:");

    try {
        const table = new Table({
            database,
            schema: personSchema
        });

        await TableCreator.createTableIfNotExistsAsync({
            database,
            schema: personSchema
        });

        await table.addAsync({ firstName: "John" });

        const john = await table.where()
            .column("firstName")
            .isEqualTo("John")
            .getFirstAsync();

        assert.equal(john.firstName, "John");
    } finally {
        database.close();
    }
};

exports["Table: updateAsync"] = async () => {
    const database = new sqlite.Database(":memory:");

    try {
        const table = new Table({
            database,
            schema: personSchema
        });

        await TableCreator.createTableIfNotExistsAsync({
            database,
            schema: personSchema
        });

        const { lastID: id } = await table.addAsync({ firstName: "John" });

        await table.updateAsync({
            id: id,
            firstName: "Jane"
        });

        const jane = await table.where()
            .column("firstName")
            .isEqualTo("Jane")
            .getFirstAsync();

        assert.equal(jane.firstName, "Jane");
    } finally {
        database.close();
    }

};

exports["Table: removeAsync"] = async () => {
    const database = new sqlite.Database(":memory:");

    try {
        const table = new Table({
            database,
            schema: personSchema
        });

        await TableCreator.createTableIfNotExistsAsync({
            database,
            schema: personSchema
        });

        const { lastID: id } = await table.addAsync({ firstName: "John" });

        await table.removeAsync({
            id: id
        });

        const john = await table.where()
            .column("firstName")
            .isEqualTo("John")
            .getFirstAsync();

        assert.equal(john, null);
    } finally {
        database.close();
    }
};

exports["Table: prepareEntityToBeAddedAsync"] = async () => {
    const database = new sqlite.Database(":memory:");

    try {
        const table = new Table({
            database,
            schema: personSchema,
            lifeCycleDelegate: {
                prepareEntityToBeAddedAsync: (entity) => {
                    return {
                        firstName: entity.firstName,
                        lastName: "Doe"
                    };
                }
            }
        });

        await TableCreator.createTableIfNotExistsAsync({
            database,
            schema: personSchema
        });
        await table.addAsync({ firstName: "John" });
        const results = await table.where().column("lastName").isEqualTo("Doe").toArrayAsync();

        assert.equal(results.length, 1);
    } finally {
        database.close();
    }
};

exports["Table: prepareEntityToBeAddedAsync:failed"] = async () => {
    const database = new sqlite.Database(":memory:");

    try {
        const table = new Table({
            database,
            schema: personSchema,
            lifeCycleDelegate: {
                prepareEntityToBeAddedAsync: () => {
                    throw new Error("Can't access database.");
                }
            }
        });

        await TableCreator.createTableIfNotExistsAsync({
            database,
            schema: personSchema
        });

        await table.addAsync({ firstName: "John" });

    } catch (error) {
        assert.equal(error.message, "Can't access database.");
    } finally {
        database.close();

    }
};

exports["Table: canEntityBeAddedAsync"] = async () => {
    let called = false;
    const database = new sqlite.Database(":memory:");

    try {
        const table = new Table({
            database,
            schema: personSchema,
            lifeCycleDelegate: {
                canEntityBeAddedAsync: (entity) => {
                    called = true;
                    return true;
                }
            }
        });

        await TableCreator.createTableIfNotExistsAsync({
            database,
            schema: personSchema
        });

        await table.addAsync({ firstName: "John" });

        assert.equal(called, true);

    } catch (error) {
        throw error;
    } finally {
        database.close();
    }
};

exports["Table: canEntityBeAddedAsync: failed"] = async () => {
    const database = new sqlite.Database(":memory:");

    try {
        const table = new Table({
            database,
            schema: personSchema,
            lifeCycleDelegate: {
                canEntityBeAddedAsync: () => {
                    throw new Error("John is already in database.");
                }
            }
        });

        await TableCreator.createTableIfNotExistsAsync({
            database,
            schema: personSchema
        });

        await table.addAsync({ firstName: "John" });

    } catch (error) {
        assert.equal(error.message, "John is already in database.");
    } finally {
        database.close();
    }
};

exports["Table: entityAddedAsync"] = async () => {
    let called = false;
    const database = new sqlite.Database(":memory:");

    try {
        const table = new Table({
            database,
            schema: personSchema,
            lifeCycleDelegate: {
                entityAddedAsync: (entity) => {
                    called = true;
                    assert.equal(entity.firstName, "John");
                }
            }
        });

        await TableCreator.createTableIfNotExistsAsync({
            database,
            schema: personSchema
        });

        await table.addAsync({ firstName: "John" });

        assert.equal(called, true);
    } finally {
        database.close();
    }
};

exports["Table: entityAddedAsync: failed"] = async () => {
    let called = false;
    const database = new sqlite.Database(":memory:");

    try {
        const table = new Table({
            database,
            schema: personSchema,
            lifeCycleDelegate: {
                entityAddedAsync: () => {
                    called = true;
                    throw new Error("Didn't complete task.");
                }
            }
        });

        await TableCreator.createTableIfNotExistsAsync({
            database,
            schema: personSchema
        });

        await table.addAsync({ firstName: "John" });

    } catch (error) {
        assert.equal(called, true);
        assert.equal(error.message, "Didn't complete task.");
    } finally {
        database.close();
    }

};

exports["Table: prepareEntityToBeUpdatedAsync"] = async () => {
    const database = new sqlite.Database(":memory:");

    try {
        const table = new Table({
            database,
            schema: personSchema,
            lifeCycleDelegate: {
                prepareEntityToBeUpdatedAsync: (entity) => {
                    // Override last name.
                    entity.lastName = "Doe";
                    return entity;
                }
            }
        });

        await TableCreator.createTableIfNotExistsAsync({
            database,
            schema: personSchema
        });

        const { lastID } = await table.addAsync({ firstName: "John" });

        await table.updateAsync({
            id: lastID,
            lastName: "Smith"
        });

        const results = await table.where().column("lastName").isEqualTo("Doe").toArrayAsync();
        assert.equal(results.length, 1);

    } finally {
        database.close();
    }
};

exports["Table: prepareEntityToBeUpdatedAsync: failed"] = async () => {
    const database = new sqlite.Database(":memory:");

    try {
        const table = new Table({
            database,
            schema: personSchema,
            lifeCycleDelegate: {
                prepareEntityToBeUpdatedAsync: () => {
                    throw new Error("Couldn't prepare entity.");
                }
            }
        });

        await TableCreator.createTableIfNotExistsAsync({
            database,
            schema: personSchema
        });


        const { lastID } = await table.addAsync({ firstName: "John" });

        await table.updateAsync({
            id: lastID,
            lastName: "Smith"
        });

        assert.fail("Expected to throw on prepareEntityToBeUpdatedAsync.");
    } catch (error) {
        assert.equal(error.message, "Couldn't prepare entity.");
    } finally {
        database.close();
    }
};

exports["Table: refineQueryable"] = async () => {
    const database = new sqlite.Database(":memory:");
    try {
        const table = new Table({
            database,
            schema: personSchema,
            lifeCycleDelegate: {
                refineQueryable: (queryable) => {
                    return queryable.or().column("lastName").isEqualTo("Doe");
                }
            }
        });

        await TableCreator.createTableIfNotExistsAsync({
            database,
            schema: personSchema
        });

        await table.addAsync({ firstName: "John", lastName: "Doe" });
        
        const results = await table.where().column("firstName").isEqualTo("Jane").toArrayAsync();
        
        assert.equal(results.length, 1);

    } finally {
        database.close();
    }
};
