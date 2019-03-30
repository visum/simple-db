
import * as assert from "assert";
import {Pool} from "pg";
import Table from "../../postgresql/Table";
import personSchema from "./testSchemas/person";
import TableCreator from "../../postgresql/TableCreator";

const pool = new Pool({
    host: "localhost",
    user: "test_user",
    password: "test_user_pass",
    database: "tests",
    port: 5432
  });

exports["Table: addAsync"] = async () => {
    try {
        const table = new Table({
            database: pool,
            schema: personSchema
        });

        await TableCreator.createTableIfNotExistsAsync({
            database: pool,
            schema: personSchema
        });

        await table.addAsync({ firstName: "John" });

        const john = await table.where()
            .column("firstName")
            .isEqualTo("John")
            .getFirstAsync();

        assert.equal(john.firstName, "John");
    }
    catch(error) {
        console.error(error);
    } 
    finally {
        await TableCreator.dropTableIfExistsAsync({
            database: pool,
            schema: personSchema
        });
    }
};

exports["Table: updateAsync"] = async () => {
    try {
        const table = new Table({
            database: pool,
            schema: personSchema
        });

        await TableCreator.createTableIfNotExistsAsync({
            database: pool,
            schema: personSchema
        });

        const { id } = await table.addAsync({ firstName: "John" });

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
        await TableCreator.dropTableIfExistsAsync({
            database: pool,
            schema: personSchema
        });
    }

};

exports["Table: removeAsync"] = async () => {

    try {
        const table = new Table({
            database: pool,
            schema: personSchema
        });

        await TableCreator.createTableIfNotExistsAsync({
            database: pool,
            schema: personSchema
        });

        const { id } = await table.addAsync({ firstName: "John" });

        await table.removeAsync({
            id: id
        });

        const john = await table.where()
            .column("firstName")
            .isEqualTo("John")
            .getFirstAsync();

        assert.equal(john, null);
    } finally {
        await TableCreator.dropTableIfExistsAsync({
            database: pool,
            schema: personSchema
        });
    }
};

exports["Table: prepareEntityToBeAddedAsync"] = async () => {
    try {
        const table = new Table({
            database: pool,
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
            database: pool,
            schema: personSchema
        });
        await table.addAsync({ firstName: "John" });
        const results = await table.where().column("lastName").isEqualTo("Doe").toArrayAsync();

        assert.equal(results.length, 1);
    } finally {
        await TableCreator.dropTableIfExistsAsync({
            database: pool,
            schema: personSchema
        });
    }
};

exports["Table: prepareEntityToBeAddedAsync:failed"] = async () => {

    try {
        const table = new Table({
            database: pool,
            schema: personSchema,
            lifeCycleDelegate: {
                prepareEntityToBeAddedAsync: () => {
                    throw new Error("Can't access database.");
                }
            }
        });

        await TableCreator.createTableIfNotExistsAsync({
            database: pool,
            schema: personSchema
        });

        await table.addAsync({ firstName: "John" });

    } catch (error) {
        assert.equal(error.message, "Can't access database.");
    } finally {
        await TableCreator.dropTableIfExistsAsync({
            database: pool,
            schema: personSchema
        });
    }
};

exports["Table: canEntityBeAddedAsync"] = async () => {
    let called = false;

    try {
        const table = new Table({
            database: pool,
            schema: personSchema,
            lifeCycleDelegate: {
                canEntityBeAddedAsync: (entity) => {
                    called = true;
                    return true;
                }
            }
        });

        await TableCreator.createTableIfNotExistsAsync({
            database: pool,
            schema: personSchema
        });

        await table.addAsync({ firstName: "John" });

        assert.equal(called, true);

    } catch (error) {
        throw error;
    } finally {
        await TableCreator.dropTableIfExistsAsync({
            database: pool,
            schema: personSchema
        });
    }
};

exports["Table: canEntityBeAddedAsync: failed"] = async () => {

    try {
        const table = new Table({
            database: pool,
            schema: personSchema,
            lifeCycleDelegate: {
                canEntityBeAddedAsync: () => {
                    throw new Error("John is already in database.");
                }
            }
        });

        await TableCreator.createTableIfNotExistsAsync({
            database: pool,
            schema: personSchema
        });

        await table.addAsync({ firstName: "John" });

    } catch (error) {
        assert.equal(error.message, "John is already in database.");
    } finally {
        await TableCreator.dropTableIfExistsAsync({
            database: pool,
            schema: personSchema
        });
    }
};

exports["Table: entityAddedAsync"] = async () => {
    let called = false;

    try {
        const table = new Table({
            database: pool,
            schema: personSchema,
            lifeCycleDelegate: {
                entityAddedAsync: (entity) => {
                    called = true;
                    assert.equal(entity.firstName, "John");
                }
            }
        });

        await TableCreator.createTableIfNotExistsAsync({
            database: pool,
            schema: personSchema
        });

        await table.addAsync({ firstName: "John" });

        assert.equal(called, true);
    } finally {
        await TableCreator.dropTableIfExistsAsync({
            database: pool,
            schema: personSchema
        });
    }
};

exports["Table: entityAddedAsync: failed"] = async () => {
    let called = false;

    try {
        const table = new Table({
            database: pool,
            schema: personSchema,
            lifeCycleDelegate: {
                entityAddedAsync: () => {
                    called = true;
                    throw new Error("Didn't complete task.");
                }
            }
        });

        await TableCreator.createTableIfNotExistsAsync({
            database: pool,
            schema: personSchema
        });

        await table.addAsync({ firstName: "John" });

    } catch (error) {
        assert.equal(called, true);
        assert.equal(error.message, "Didn't complete task.");
    } finally {
        await TableCreator.dropTableIfExistsAsync({
            database: pool,
            schema: personSchema
        });
    }

};

exports["Table: prepareEntityToBeUpdatedAsync"] = async () => {

    try {
        const table = new Table({
            database: pool,
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
            database: pool,
            schema: personSchema
        });

        const { id } = await table.addAsync({ firstName: "John" });

        await table.updateAsync({
            id: id,
            lastName: "Smith"
        });

        const results = await table.where().column("lastName").isEqualTo("Doe").toArrayAsync();
        assert.equal(results.length, 1);

    } finally {
        await TableCreator.dropTableIfExistsAsync({
            database: pool,
            schema: personSchema
        });
    }
};

exports["Table: prepareEntityToBeUpdatedAsync: failed"] = async () => {

    try {
        const table = new Table({
            database: pool,
            schema: personSchema,
            lifeCycleDelegate: {
                prepareEntityToBeUpdatedAsync: () => {
                    throw new Error("Couldn't prepare entity.");
                }
            }
        });

        await TableCreator.createTableIfNotExistsAsync({
            database: pool,
            schema: personSchema
        });


        const { id } = await table.addAsync({ firstName: "John" });

        await table.updateAsync({
            id: id,
            lastName: "Smith"
        });

        assert.fail("Expected to throw on prepareEntityToBeUpdatedAsync.");
    } catch (error) {
        assert.equal(error.message, "Couldn't prepare entity.");
    } finally {
        await TableCreator.dropTableIfExistsAsync({
            database: pool,
            schema: personSchema
        });
    }
};

exports["Table: refineQueryable"] = async () => {
    
    try {
        const table = new Table({
            database: pool,
            schema: personSchema,
            lifeCycleDelegate: {
                refineQueryable: (queryable) => {
                    return queryable.or().column("lastName").isEqualTo("Doe");
                }
            }
        });

        await TableCreator.createTableIfNotExistsAsync({
            database: pool,
            schema: personSchema
        });

        await table.addAsync({ firstName: "John", lastName: "Doe" });
        
        const results = await table.where().column("firstName").isEqualTo("Jane").toArrayAsync();
        
        assert.equal(results.length, 1);

    } finally {
        await TableCreator.dropTableIfExistsAsync({
            database: pool,
            schema: personSchema
        });
    }
};
