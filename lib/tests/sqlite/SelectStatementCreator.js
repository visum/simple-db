"use strict";

var assert = _interopRequireWildcard(require("assert"));

var _SelectStatementCreator = _interopRequireDefault(require("../../sqlite/statements/SelectStatementCreator"));

var _Queryable = _interopRequireDefault(require("../../queryable/Queryable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

exports["SelectStatementCreator: isEqualTo."] = () => {
  const queryable = new _Queryable.default({
    query: {
      type: "table"
    }
  }).column("columnName").isEqualTo("value");
  const selectStatementCreator = new _SelectStatementCreator.default(queryable);
  const {
    sql
  } = selectStatementCreator.createStatement();
  const expected = `SELECT * FROM "table" WHERE "columnName" = 'value' LIMIT -1 OFFSET 0`;
  assert.equal(sql, expected);
};

exports["SelectStatementCreator: isNotEqualTo."] = () => {
  const queryable = new _Queryable.default({
    query: {
      type: "table"
    }
  }).column("columnName").isNotEqualTo("value");
  const selectStatementCreator = new _SelectStatementCreator.default(queryable);
  const {
    sql
  } = selectStatementCreator.createStatement();
  const expected = `SELECT * FROM "table" WHERE "columnName" != 'value' LIMIT -1 OFFSET 0`;
  assert.equal(sql, expected);
};

exports["SelectStatementCreator: contains."] = () => {
  const queryable = new _Queryable.default({
    query: {
      type: "table"
    }
  }).column("columnName").contains("value");
  const selectStatementCreator = new _SelectStatementCreator.default(queryable);
  const {
    sql
  } = selectStatementCreator.createStatement();
  const expected = `SELECT * FROM "table" WHERE "columnName" LIKE '%value%' ESCAPE '\\' LIMIT -1 OFFSET 0`;
  assert.equal(sql, expected);
};

exports["SelectStatementCreator: startsWith."] = () => {
  const queryable = new _Queryable.default({
    query: {
      type: "table"
    }
  }).column("columnName").startsWith("value");
  const selectStatementCreator = new _SelectStatementCreator.default(queryable);
  const {
    sql
  } = selectStatementCreator.createStatement();
  const expected = `SELECT * FROM "table" WHERE "columnName" LIKE 'value%' ESCAPE '\\' LIMIT -1 OFFSET 0`;
  assert.equal(sql, expected);
};

exports["SelectStatementCreator: endsWith."] = () => {
  const queryable = new _Queryable.default({
    query: {
      type: "table"
    }
  }).column("columnName").endsWith("value");
  const selectStatementCreator = new _SelectStatementCreator.default(queryable);
  const {
    sql
  } = selectStatementCreator.createStatement();
  const expected = `SELECT * FROM "table" WHERE "columnName" LIKE '%value' ESCAPE '\\' LIMIT -1 OFFSET 0`;
  assert.equal(sql, expected);
};

exports["SelectStatementCreator: isGreaterThan."] = () => {
  const queryable = new _Queryable.default({
    query: {
      type: "table"
    }
  }).column("columnName").isGreaterThan(0);
  const selectStatementCreator = new _SelectStatementCreator.default(queryable);
  const {
    sql
  } = selectStatementCreator.createStatement();
  const expected = `SELECT * FROM "table" WHERE "columnName" > 0 LIMIT -1 OFFSET 0`;
  assert.equal(sql, expected);
};

exports["SelectStatementCreator: isGreaterThanOrEqualTo."] = () => {
  const queryable = new _Queryable.default({
    query: {
      type: "table"
    }
  }).column("columnName").isGreaterThanOrEqualTo(0);
  const selectStatementCreator = new _SelectStatementCreator.default(queryable);
  const {
    sql
  } = selectStatementCreator.createStatement();
  const expected = `SELECT * FROM "table" WHERE "columnName" >= 0 LIMIT -1 OFFSET 0`;
  assert.equal(sql, expected);
};

exports["SelectStatementCreator: isLessThan."] = () => {
  const queryable = new _Queryable.default({
    query: {
      type: "table"
    }
  }).column("columnName").isLessThan(0);
  const selectStatementCreator = new _SelectStatementCreator.default(queryable);
  const {
    sql
  } = selectStatementCreator.createStatement();
  const expected = `SELECT * FROM "table" WHERE "columnName" < 0 LIMIT -1 OFFSET 0`;
  assert.equal(sql, expected);
};

exports["SelectStatementCreator: isLessThanOrEqualTo."] = () => {
  const queryable = new _Queryable.default({
    query: {
      type: "table"
    }
  }).column("columnName").isLessThanOrEqualTo(0);
  const selectStatementCreator = new _SelectStatementCreator.default(queryable);
  const {
    sql
  } = selectStatementCreator.createStatement();
  const expected = `SELECT * FROM "table" WHERE "columnName" <= 0 LIMIT -1 OFFSET 0`;
  assert.equal(sql, expected);
};

exports["SelectStatementCreator: isIn with array."] = () => {
  const queryable = new _Queryable.default({
    query: {
      type: "table"
    }
  }).column("columnName").isIn(["John", "Jane"]);
  const selectStatementCreator = new _SelectStatementCreator.default(queryable);
  const {
    sql
  } = selectStatementCreator.createStatement();
  const expected = `SELECT * FROM "table" WHERE "columnName" IN ('John', 'Jane') LIMIT -1 OFFSET 0`;
  assert.equal(sql, expected);
};

exports["SelectStatementCreator: isNotIn with array."] = () => {
  const queryable = new _Queryable.default({
    query: {
      type: "table"
    }
  }).column("columnName").isNotIn(["John", "Jane"]);
  const selectStatementCreator = new _SelectStatementCreator.default(queryable);
  const {
    sql
  } = selectStatementCreator.createStatement();
  const expected = `SELECT * FROM "table" WHERE "columnName" NOT IN ('John', 'Jane') LIMIT -1 OFFSET 0`;
  assert.equal(sql, expected);
};

exports["SelectStatementCreator: isIn with queryable."] = () => {
  const queryable = new _Queryable.default({
    query: {
      type: "other_table"
    }
  }).select({
    id: "id"
  });
  const rootQueryable = new _Queryable.default({
    query: {
      type: "table"
    }
  }).column("columnName").isIn(queryable);
  const selectStatementCreator = new _SelectStatementCreator.default(rootQueryable);
  const {
    sql
  } = selectStatementCreator.createStatement();
  const expected = `SELECT * FROM "table" WHERE "columnName" IN (SELECT id AS id FROM "other_table" LIMIT -1 OFFSET 0) LIMIT -1 OFFSET 0`;
  assert.equal(sql, expected);
};

exports["SelectStatementCreator: isNotIn with queryable."] = () => {
  const queryable = new _Queryable.default({
    query: {
      type: "other_table"
    }
  }).select({
    id: "id"
  });
  const rootQueryable = new _Queryable.default({
    query: {
      type: "table"
    }
  }).column("columnName").isNotIn(queryable);
  const selectStatementCreator = new _SelectStatementCreator.default(rootQueryable);
  const {
    sql
  } = selectStatementCreator.createStatement();
  const expected = `SELECT * FROM "table" WHERE "columnName" NOT IN (SELECT id AS id FROM "other_table" LIMIT -1 OFFSET 0) LIMIT -1 OFFSET 0`;
  assert.equal(sql, expected);
};
//# sourceMappingURL=SelectStatementCreator.js.map