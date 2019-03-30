"use strict";

var assert = _interopRequireWildcard(require("assert"));

var _TableCreator = _interopRequireDefault(require("../../postgresql/TableCreator"));

var _pg = require("pg");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const pool = new _pg.Pool({
  host: "localhost",
  user: "test_user",
  password: "test_user_pass",
  database: "tests",
  port: 5432
});
const otherTable = {
  name: "other_table",
  label: "Other Table",
  description: "Some other great table",
  version: "1.0.0",
  columns: [{
    type: "INTEGER",
    name: "id",
    label: "Identifier"
  }, {
    type: "TEXT",
    name: "text",
    label: "Text",
    description: "Some Description."
  }],
  primaryKeys: ["id"]
};
const testSchema = {
  name: "table",
  label: "Table",
  description: "Some great description.",
  version: "1.0.1",
  columns: [{
    type: "INTEGER",
    name: "id",
    label: "Identifier"
  }, {
    type: "TEXT",
    name: "text",
    label: "Text",
    description: "Some Description."
  }, {
    type: "REAL",
    name: "real",
    label: "Float",
    isNullable: false
  }, {
    type: "INTEGER",
    name: "manyToOne",
    label: "Many To One Identifier",
    isNullable: false
  }, {
    type: "INTEGER",
    name: "oneToOne",
    label: "One to One Identifier",
    isNullable: false
  }],
  primaryKeys: ["id"],
  unique: {},
  foreignKeys: {
    manyToOne: {
      label: "Source",
      source: {
        name: "other_table",
        version: "1.0.0",
        label: "Many",
        column: "id"
      }
    },
    oneToOne: {
      label: "Source",
      source: {
        name: "other_table",
        version: "1.0.0",
        label: "One",
        column: "id"
      }
    }
  }
};

const dropTablesAsync = async () => {
  await _TableCreator.default.dropTableIfExistsAsync({
    schema: testSchema,
    database: pool
  });
  await _TableCreator.default.dropTableIfExistsAsync({
    schema: otherTable,
    database: pool
  });
};

exports['clean'] = dropTablesAsync;

exports["TableCreator: createTableIfNotExistsAsync."] = async () => {
  const tableCreator = new _TableCreator.default({
    schema: otherTable,
    database: pool
  });

  try {
    await tableCreator.createTableIfNotExistsAsync();
  } catch (e) {
    console.log(e);
  }

  return;
};

exports["TableCreator: createTableIfNotExistsAsync with foreign keys."] = async () => {
  const otherTableCreator = new _TableCreator.default({
    schema: otherTable,
    database: pool
  });
  const tableCreator = new _TableCreator.default({
    schema: testSchema,
    database: pool
  });
  await otherTableCreator.createTableIfNotExistsAsync();
  return await tableCreator.createTableIfNotExistsAsync();
};

exports["TableCreator: createTableIfNotExistsAsync twice."] = async () => {
  const tableCreator = new _TableCreator.default({
    schema: otherTable,
    database: pool
  });
  await tableCreator.createTableIfNotExistsAsync();
  return await tableCreator.createTableIfNotExistsAsync();
};

exports["TableCreator: createTableIfNotExistsAsync then Drop"] = async () => {
  const tableCreator = new _TableCreator.default({
    schema: otherTable,
    database: pool
  });
  await tableCreator.createTableIfNotExistsAsync();
  return await tableCreator.dropTableIfExistsAsync();
};
//# sourceMappingURL=TableCreator.js.map