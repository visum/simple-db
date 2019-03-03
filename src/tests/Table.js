
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

exports["Table: prepareEntityToBeAddedAsync"] = function () {
    const database = new sqlite.Database(":memory:");
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

    return TableCreator.createTableIfNotExistsAsync({
        database,
        schema: personSchema
    }).then(() => {
        return table.addAsync({ firstName: "John" });
    }).then(() => {
        return table.where().column("lastName").isEqualTo("Doe").toArrayAsync();
    }).then((results) => {
        assert.equal(results.length, 1);
        database.close();
    }).catch((error) => {
        database.close();
        throw error;
    })
};

exports["Table: prepareEntityToBeAddedAsync:failed"] = function () {
    const database = new sqlite.Database(":memory:");
    const table = new Table({
        database,
        schema: personSchema,
        lifeCycleDelegate: {
            prepareEntityToBeAddedAsync: (entity) => {
                throw new Error("Can't access database.");
            }
        }
    });

    return TableCreator.createTableIfNotExistsAsync({
        database,
        schema: personSchema
    }).then(() => {
        return table.addAsync({ firstName: "John" });
    }).catch((error) => {
        assert.equal(error.message, "Can't access database.");
        database.close();
    })
};

exports["Table: canEntityBeAddedAsync"] = function () {
    let called = false;
    const database = new sqlite.Database(":memory:");
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

    return TableCreator.createTableIfNotExistsAsync({
        database,
        schema: personSchema
    }).then(() => {
        return table.addAsync({ firstName: "John" });
    }).then(() => {
        assert.equal(called, true);
    }).catch((error) => {
        database.close();
        throw error;
    })
};

exports["Table: canEntityBeAddedAsync: failed"] = function () {
    const database = new sqlite.Database(":memory:");
    const table = new Table({
        database,
        schema: personSchema,
        lifeCycleDelegate: {
            canEntityBeAddedAsync: (entity) => {
                let called = false;
                throw new Error("John is already in database.");
            }
        }
    });

    return TableCreator.createTableIfNotExistsAsync({
        database,
        schema: personSchema
    }).then(() => {
        return table.addAsync({ firstName: "John" });
    }).catch((error) => {
        assert.equal(error.message, "John is already in database.");
        database.close();
    })
};

exports["Table: entityAddedAsync"] = function () {
    let called = false;
    const database = new sqlite.Database(":memory:");
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

    return TableCreator.createTableIfNotExistsAsync({
        database,
        schema: personSchema
    }).then(() => {
        return table.addAsync({ firstName: "John" });
    }).then(() => {
        assert.equal(called, true);
    }).catch((error) => {
        database.close();
        throw error;
    })
};

exports["Table: entityAddedAsync: failed"] = function () {
    let called = false;
    const database = new sqlite.Database(":memory:");
    const table = new Table({
        database,
        schema: personSchema,
        lifeCycleDelegate: {
            entityAddedAsync: (entity) => {
                called = true;
                throw new Error("Didn't complete task.");
            }
        }
    });

    return TableCreator.createTableIfNotExistsAsync({
        database,
        schema: personSchema
    }).then(() => {
        return table.addAsync({ firstName: "John" });
    }).then(() => {
        assert.equal(called, true);
    }).catch((error) => {
        database.close();
        throw error;
    })
};

exports["Table: prepareEntityToBeUpdatedAsync"] = function () {
    const database = new sqlite.Database(":memory:");
    const table = new Table({
        database,
        schema: personSchema,
        lifeCycleDelegate: {
            prepareEntityToBeUpdatedAsync: (entity) => {
                entity.lastName = "Doe";
                return entity;
            }
        }
    });

    return TableCreator.createTableIfNotExistsAsync({
        database,
        schema: personSchema
    }).then(() => {
        return table.addAsync({ firstName: "John" });
    }).then(({ lastID }) => {
        return table.updateAsync({
            id: lastID,
            lastName: "Smith"
        });
    }).then(() => {
        return table.where().column("lastName").isEqualTo("Doe").toArrayAsync();
    }).then((results) => {
        assert.equal(results.length, 1);
        database.close();
    }).catch((error) => {
        database.close();
        throw error;
    })
};

exports["Table: refineQueryable"] = function () {
    const database = new sqlite.Database(":memory:");
    const table = new Table({
        database,
        schema: personSchema,
        lifeCycleDelegate: {
            refineQueryable: (queryable) => {
                return queryable.or().column("lastName").isEqualTo("Doe");
            }
        }
    });

    return TableCreator.createTableIfNotExistsAsync({
        database,
        schema: personSchema
    }).then(() => {
        return table.addAsync({ firstName: "John", lastName: "Doe" });
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
