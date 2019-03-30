"use strict";

var assert = _interopRequireWildcard(require("assert"));

var _pg = require("pg");

var _Table = _interopRequireDefault(require("../../postgresql/Table"));

var _person = _interopRequireDefault(require("./testSchemas/person"));

var _TableCreator = _interopRequireDefault(require("../../postgresql/TableCreator"));

var _Queryable = _interopRequireDefault(require("../../../lib/queryable/Queryable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const pool = new _pg.Pool({
  host: "localhost",
  user: "test_user",
  password: "test_user_pass",
  database: "tests",
  port: 5432
});

const createDatabaseAsync = () => {
  return _TableCreator.default.createTableIfNotExistsAsync({
    database: pool,
    schema: _person.default
  });
};

const dropTableAsync = () => {
  return _TableCreator.default.dropTableIfExistsAsync({
    database: pool,
    schema: _person.default
  });
};

const fillDatabaseAsync = table => {
  const tests = [];

  for (let x = 0; x < 300; x++) {
    const testsPromise = table.addAsync({
      firstName: `John_${x}_`
    });
    tests.push(testsPromise);
  }

  return Promise.all(tests);
};

exports["Queryable: toArrayAsync."] = async () => {
  try {
    await createDatabaseAsync();
    const table = new _Table.default({
      database: pool,
      schema: _person.default
    });
    await fillDatabaseAsync(table);
    let results = await table.where().column("firstName").endsWith("ohn_1_").or().column("firstName").startsWith("John_2_").and().column("firstName").contains("John").orderByDesc("id").toArrayAsync();
    assert.equal(results.length, 2);
    await table.where().column("firstName").contains("John").removeAsync();
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
    const table = new _Table.default({
      database: pool,
      schema: _person.default
    });
    await fillDatabaseAsync(table);
    const isInExpression = table.where().select({
      "firstName": "firstName"
    }).take(1);
    const results = await table.where().column("firstName").isIn(isInExpression).toArrayAsync();
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
    const table = new _Table.default({
      database: pool,
      schema: _person.default
    });
    await fillDatabaseAsync(table);
    const results = await table.where().column("firstName").isIn([`John_1_`]).toArrayAsync();
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
    const table = new _Table.default({
      database: pool,
      schema: _person.default
    });
    await fillDatabaseAsync(table);
    const result = await table.where().column("firstName").endsWith("_1_").getFirstAsync();
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
    const table = new _Table.default({
      database: pool,
      schema: _person.default
    });
    await fillDatabaseAsync(table);
    await table.where().column("firstName").contains("John").removeAsync();
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
    const table = new _Table.default({
      database: pool,
      schema: _person.default
    });
    await fillDatabaseAsync(table);
    await table.where().column("firstName").endsWith("hn_1_").updateAsync({
      firstName: "Jane"
    });
    const results = await table.where().column("firstName").endsWith("Jane").toArrayAsync();
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
    const table = new _Table.default({
      database: pool,
      schema: _person.default
    });
    await fillDatabaseAsync(table);
    const count = await table.where().column("firstName").contains("John").getCountAsync();
    assert.equal(count, 300);
  } catch (error) {
    throw error;
  } finally {
    await dropTableAsync();
  }
};

exports["Queryable: toJson"] = function () {
  const queryable = new _Queryable.default({
    query: {
      type: "person"
    }
  });
  const json = queryable.column("firstName").isEqualTo("Joe").toJson();
  assert.equal(json, `{"type":"person","expression":{"type":"isEqualTo","isComposite":true,"children":[{"type":"property","isComposite":true,"children":[{"type":"type","isComposite":false,"value":"person"},{"type":"propertyName","isComposite":false,"value":"firstName"}]},{"type":"string","isComposite":false,"value":"Joe"}]},"select":{},"limit":-1,"offset":0,"orderBy":[]}`);
};

exports["Queryable: fromJson"] = function () {
  const queryable = new _Queryable.default({
    query: {
      type: "person"
    }
  });
  const roleQueryable = new _Queryable.default({
    query: {
      type: "role"
    }
  }).column("name").isEqualTo("admin").select({
    id: "id"
  });
  const json = queryable.column("firstName").isEqualTo("Joe").and().column("roleId").isIn(roleQueryable).toJson();

  const queryable2 = _Queryable.default.fromJson(json);

  const json2 = queryable2.toJson();
  assert.equal(json, json2);
};
//# sourceMappingURL=Queryable.js.map