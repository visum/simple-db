"use strict";

var _assert = require("assert");

var assert = _interopRequireWildcard(_assert);

var _UpdateStatementCreator = require("../sqlite/statements/UpdateStatementCreator");

var _UpdateStatementCreator2 = _interopRequireDefault(_UpdateStatementCreator);

var _person = require("../testSchemas/person");

var _person2 = _interopRequireDefault(_person);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports["UpdateStatementCreator: createStatement."] = function () {
    var entity = {
        id: 1,
        firstName: "John"
    };
    var tableName = _person2.default.name;
    var primaryKeys = _person2.default.primaryKeys;
    var updateStatementCreator = new _UpdateStatementCreator2.default({
        entity: entity,
        tableName: tableName,
        primaryKeys: primaryKeys
    });

    var _updateStatementCreat = updateStatementCreator.createStatement(),
        sql = _updateStatementCreat.sql,
        values = _updateStatementCreat.values;

    var expected = "UPDATE \"person\" SET \"firstName\" = ? WHERE \"id\" = 1";
    assert.equal(values[0], "John");

    assert.equal(sql, expected);
    assert.equal(values[0], "John");
    assert.equal(values.length, 1);
};
//# sourceMappingURL=UpdateStatementCreator.js.map