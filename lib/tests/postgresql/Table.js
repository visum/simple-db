"use strict";

var assert = _interopRequireWildcard(require("assert"));

var _pg = require("pg");

var _Table = _interopRequireDefault(require("../../postgresql/Table"));

var _person = _interopRequireDefault(require("./testSchemas/person"));

var _TableCreator = _interopRequireDefault(require("../../postgresql/TableCreator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const pool = new _pg.Pool({
  host: "localhost",
  user: "test_user",
  password: "test_user_pass",
  database: "tests",
  port: 5432
});

exports["Table: addAsync"] = async () => {
  try {
    const table = new _Table.default({
      database: pool,
      schema: _person.default
    });
    await _TableCreator.default.createTableIfNotExistsAsync({
      database: pool,
      schema: _person.default
    });
    await table.addAsync({
      firstName: "John"
    });
    const john = await table.where().column("firstName").isEqualTo("John").getFirstAsync();
    assert.equal(john.firstName, "John");
  } catch (error) {
    console.error(error);
  } finally {
    await _TableCreator.default.dropTableIfExistsAsync({
      database: pool,
      schema: _person.default
    });
  }
};

exports["Table: updateAsync"] = async () => {
  try {
    const table = new _Table.default({
      database: pool,
      schema: _person.default
    });
    await _TableCreator.default.createTableIfNotExistsAsync({
      database: pool,
      schema: _person.default
    });
    const {
      id
    } = await table.addAsync({
      firstName: "John"
    });
    await table.updateAsync({
      id: id,
      firstName: "Jane"
    });
    const jane = await table.where().column("firstName").isEqualTo("Jane").getFirstAsync();
    assert.equal(jane.firstName, "Jane");
  } finally {
    await _TableCreator.default.dropTableIfExistsAsync({
      database: pool,
      schema: _person.default
    });
  }
};

exports["Table: removeAsync"] = async () => {
  try {
    const table = new _Table.default({
      database: pool,
      schema: _person.default
    });
    await _TableCreator.default.createTableIfNotExistsAsync({
      database: pool,
      schema: _person.default
    });
    const {
      id
    } = await table.addAsync({
      firstName: "John"
    });
    await table.removeAsync({
      id: id
    });
    const john = await table.where().column("firstName").isEqualTo("John").getFirstAsync();
    assert.equal(john, null);
  } finally {
    await _TableCreator.default.dropTableIfExistsAsync({
      database: pool,
      schema: _person.default
    });
  }
};

exports["Table: prepareEntityToBeAddedAsync"] = async () => {
  try {
    const table = new _Table.default({
      database: pool,
      schema: _person.default,
      lifeCycleDelegate: {
        prepareEntityToBeAddedAsync: entity => {
          return {
            firstName: entity.firstName,
            lastName: "Doe"
          };
        }
      }
    });
    await _TableCreator.default.createTableIfNotExistsAsync({
      database: pool,
      schema: _person.default
    });
    await table.addAsync({
      firstName: "John"
    });
    const results = await table.where().column("lastName").isEqualTo("Doe").toArrayAsync();
    assert.equal(results.length, 1);
  } finally {
    await _TableCreator.default.dropTableIfExistsAsync({
      database: pool,
      schema: _person.default
    });
  }
};

exports["Table: prepareEntityToBeAddedAsync:failed"] = async () => {
  try {
    const table = new _Table.default({
      database: pool,
      schema: _person.default,
      lifeCycleDelegate: {
        prepareEntityToBeAddedAsync: () => {
          throw new Error("Can't access database.");
        }
      }
    });
    await _TableCreator.default.createTableIfNotExistsAsync({
      database: pool,
      schema: _person.default
    });
    await table.addAsync({
      firstName: "John"
    });
  } catch (error) {
    assert.equal(error.message, "Can't access database.");
  } finally {
    await _TableCreator.default.dropTableIfExistsAsync({
      database: pool,
      schema: _person.default
    });
  }
};

exports["Table: canEntityBeAddedAsync"] = async () => {
  let called = false;

  try {
    const table = new _Table.default({
      database: pool,
      schema: _person.default,
      lifeCycleDelegate: {
        canEntityBeAddedAsync: entity => {
          called = true;
          return true;
        }
      }
    });
    await _TableCreator.default.createTableIfNotExistsAsync({
      database: pool,
      schema: _person.default
    });
    await table.addAsync({
      firstName: "John"
    });
    assert.equal(called, true);
  } catch (error) {
    throw error;
  } finally {
    await _TableCreator.default.dropTableIfExistsAsync({
      database: pool,
      schema: _person.default
    });
  }
};

exports["Table: canEntityBeAddedAsync: failed"] = async () => {
  try {
    const table = new _Table.default({
      database: pool,
      schema: _person.default,
      lifeCycleDelegate: {
        canEntityBeAddedAsync: () => {
          throw new Error("John is already in database.");
        }
      }
    });
    await _TableCreator.default.createTableIfNotExistsAsync({
      database: pool,
      schema: _person.default
    });
    await table.addAsync({
      firstName: "John"
    });
  } catch (error) {
    assert.equal(error.message, "John is already in database.");
  } finally {
    await _TableCreator.default.dropTableIfExistsAsync({
      database: pool,
      schema: _person.default
    });
  }
};

exports["Table: entityAddedAsync"] = async () => {
  let called = false;

  try {
    const table = new _Table.default({
      database: pool,
      schema: _person.default,
      lifeCycleDelegate: {
        entityAddedAsync: entity => {
          called = true;
          assert.equal(entity.firstName, "John");
        }
      }
    });
    await _TableCreator.default.createTableIfNotExistsAsync({
      database: pool,
      schema: _person.default
    });
    await table.addAsync({
      firstName: "John"
    });
    assert.equal(called, true);
  } finally {
    await _TableCreator.default.dropTableIfExistsAsync({
      database: pool,
      schema: _person.default
    });
  }
};

exports["Table: entityAddedAsync: failed"] = async () => {
  let called = false;

  try {
    const table = new _Table.default({
      database: pool,
      schema: _person.default,
      lifeCycleDelegate: {
        entityAddedAsync: () => {
          called = true;
          throw new Error("Didn't complete task.");
        }
      }
    });
    await _TableCreator.default.createTableIfNotExistsAsync({
      database: pool,
      schema: _person.default
    });
    await table.addAsync({
      firstName: "John"
    });
  } catch (error) {
    assert.equal(called, true);
    assert.equal(error.message, "Didn't complete task.");
  } finally {
    await _TableCreator.default.dropTableIfExistsAsync({
      database: pool,
      schema: _person.default
    });
  }
};

exports["Table: prepareEntityToBeUpdatedAsync"] = async () => {
  try {
    const table = new _Table.default({
      database: pool,
      schema: _person.default,
      lifeCycleDelegate: {
        prepareEntityToBeUpdatedAsync: entity => {
          // Override last name.
          entity.lastName = "Doe";
          return entity;
        }
      }
    });
    await _TableCreator.default.createTableIfNotExistsAsync({
      database: pool,
      schema: _person.default
    });
    const {
      id
    } = await table.addAsync({
      firstName: "John"
    });
    await table.updateAsync({
      id: id,
      lastName: "Smith"
    });
    const results = await table.where().column("lastName").isEqualTo("Doe").toArrayAsync();
    assert.equal(results.length, 1);
  } finally {
    await _TableCreator.default.dropTableIfExistsAsync({
      database: pool,
      schema: _person.default
    });
  }
};

exports["Table: prepareEntityToBeUpdatedAsync: failed"] = async () => {
  try {
    const table = new _Table.default({
      database: pool,
      schema: _person.default,
      lifeCycleDelegate: {
        prepareEntityToBeUpdatedAsync: () => {
          throw new Error("Couldn't prepare entity.");
        }
      }
    });
    await _TableCreator.default.createTableIfNotExistsAsync({
      database: pool,
      schema: _person.default
    });
    const {
      id
    } = await table.addAsync({
      firstName: "John"
    });
    await table.updateAsync({
      id: id,
      lastName: "Smith"
    });
    assert.fail("Expected to throw on prepareEntityToBeUpdatedAsync.");
  } catch (error) {
    assert.equal(error.message, "Couldn't prepare entity.");
  } finally {
    await _TableCreator.default.dropTableIfExistsAsync({
      database: pool,
      schema: _person.default
    });
  }
};

exports["Table: refineQueryable"] = async () => {
  try {
    const table = new _Table.default({
      database: pool,
      schema: _person.default,
      lifeCycleDelegate: {
        refineQueryable: queryable => {
          return queryable.or().column("lastName").isEqualTo("Doe");
        }
      }
    });
    await _TableCreator.default.createTableIfNotExistsAsync({
      database: pool,
      schema: _person.default
    });
    await table.addAsync({
      firstName: "John",
      lastName: "Doe"
    });
    const results = await table.where().column("firstName").isEqualTo("Jane").toArrayAsync();
    assert.equal(results.length, 1);
  } finally {
    await _TableCreator.default.dropTableIfExistsAsync({
      database: pool,
      schema: _person.default
    });
  }
};
//# sourceMappingURL=Table.js.map