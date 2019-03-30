"use strict";

var assert = _interopRequireWildcard(require("assert"));

var _CountStatementCreator = _interopRequireDefault(require("../../postgresql/statements/CountStatementCreator"));

var _Queryable = _interopRequireDefault(require("../../queryable/Queryable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

exports["PG CountStatementCreator: IsEqualTo"] = () => {
  const queryable = new _Queryable.default({
    query: {
      type: "table"
    }
  }).column("columnName").isEqualTo("value");
  const countStatementCreator = new _CountStatementCreator.default(queryable);
  const {
    sql
  } = countStatementCreator.createStatement();
  const expected = `SELECT count(*) FROM "table" WHERE "columnName" = 'value'`;
  assert.equal(sql, expected);
};

exports["PG CountStatementCreator: Empty"] = () => {
  const queryable = new _Queryable.default({
    query: {
      type: "table"
    }
  });
  const countStatementCreator = new _CountStatementCreator.default(queryable);
  const {
    sql
  } = countStatementCreator.createStatement();
  const expected = `SELECT count(*) FROM "table"`;
  assert.equal(sql, expected);
};
//# sourceMappingURL=CountStatementCreator.js.map