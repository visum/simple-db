"use strict";

var assert = _interopRequireWildcard(require("assert"));

var _UpdateStatementCreator = _interopRequireDefault(require("../sqlite/statements/UpdateStatementCreator"));

var _person = _interopRequireDefault(require("../testSchemas/person"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

exports["UpdateStatementCreator: createStatement."] = () => {
  const entity = {
    id: 1,
    firstName: "John"
  };
  const tableName = _person.default.name;
  const primaryKeys = _person.default.primaryKeys;
  const updateStatementCreator = new _UpdateStatementCreator.default({
    entity,
    tableName,
    primaryKeys
  });
  const {
    sql,
    values
  } = updateStatementCreator.createStatement();
  const expected = `UPDATE "person" SET "firstName" = ? WHERE "id" = 1`;
  assert.equal(values[0], "John");
  assert.equal(sql, expected);
  assert.equal(values[0], "John");
  assert.equal(values.length, 1);
};
//# sourceMappingURL=UpdateStatementCreator.js.map