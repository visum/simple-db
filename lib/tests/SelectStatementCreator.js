"use strict";

var _assert = require("assert");

var assert = _interopRequireWildcard(_assert);

var _SelectStatementCreator = require("../sqlite/statements/SelectStatementCreator");

var _SelectStatementCreator2 = _interopRequireDefault(_SelectStatementCreator);

var _Queryable = require("../queryable/Queryable");

var _Queryable2 = _interopRequireDefault(_Queryable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports["SelectStatementCreator: isEqualTo."] = function () {
    var queryable = new _Queryable2.default({ type: "table" }).column("columnName").isEqualTo("value");
    var selectStatementCreator = new _SelectStatementCreator2.default(queryable);

    var _selectStatementCreat = selectStatementCreator.createStatement(),
        sql = _selectStatementCreat.sql;

    var expected = "SELECT * FROM \"table\" WHERE \"columnName\" = 'value' LIMIT -1 OFFSET 0";

    assert.equal(sql, expected);
};

exports["SelectStatementCreator: isNotEqualTo."] = function () {
    var queryable = new _Queryable2.default({ type: "table" }).column("columnName").isNotEqualTo("value");
    var selectStatementCreator = new _SelectStatementCreator2.default(queryable);

    var _selectStatementCreat2 = selectStatementCreator.createStatement(),
        sql = _selectStatementCreat2.sql;

    var expected = "SELECT * FROM \"table\" WHERE \"columnName\" != 'value' LIMIT -1 OFFSET 0";

    assert.equal(sql, expected);
};

exports["SelectStatementCreator: contains."] = function () {
    var queryable = new _Queryable2.default({ type: "table" }).column("columnName").contains("value");
    var selectStatementCreator = new _SelectStatementCreator2.default(queryable);

    var _selectStatementCreat3 = selectStatementCreator.createStatement(),
        sql = _selectStatementCreat3.sql;

    var expected = "SELECT * FROM \"table\" WHERE \"columnName\" LIKE '%value%' ESCAPE '\\' LIMIT -1 OFFSET 0";

    assert.equal(sql, expected);
};

exports["SelectStatementCreator: startsWith."] = function () {
    var queryable = new _Queryable2.default({ type: "table" }).column("columnName").startsWith("value");
    var selectStatementCreator = new _SelectStatementCreator2.default(queryable);

    var _selectStatementCreat4 = selectStatementCreator.createStatement(),
        sql = _selectStatementCreat4.sql;

    var expected = "SELECT * FROM \"table\" WHERE \"columnName\" LIKE 'value%' ESCAPE '\\' LIMIT -1 OFFSET 0";

    assert.equal(sql, expected);
};

exports["SelectStatementCreator: endsWith."] = function () {
    var queryable = new _Queryable2.default({ type: "table" }).column("columnName").endsWith("value");
    var selectStatementCreator = new _SelectStatementCreator2.default(queryable);

    var _selectStatementCreat5 = selectStatementCreator.createStatement(),
        sql = _selectStatementCreat5.sql;

    var expected = "SELECT * FROM \"table\" WHERE \"columnName\" LIKE '%value' ESCAPE '\\' LIMIT -1 OFFSET 0";

    assert.equal(sql, expected);
};

exports["SelectStatementCreator: isGreaterThan."] = function () {
    var queryable = new _Queryable2.default({ type: "table" }).column("columnName").isGreaterThan(0);
    var selectStatementCreator = new _SelectStatementCreator2.default(queryable);

    var _selectStatementCreat6 = selectStatementCreator.createStatement(),
        sql = _selectStatementCreat6.sql;

    var expected = "SELECT * FROM \"table\" WHERE \"columnName\" > 0 LIMIT -1 OFFSET 0";

    assert.equal(sql, expected);
};

exports["SelectStatementCreator: isGreaterThanOrEqualTo."] = function () {
    var queryable = new _Queryable2.default({ type: "table" }).column("columnName").isGreaterThanOrEqualTo(0);
    var selectStatementCreator = new _SelectStatementCreator2.default(queryable);

    var _selectStatementCreat7 = selectStatementCreator.createStatement(),
        sql = _selectStatementCreat7.sql;

    var expected = "SELECT * FROM \"table\" WHERE \"columnName\" >= 0 LIMIT -1 OFFSET 0";

    assert.equal(sql, expected);
};

exports["SelectStatementCreator: isLessThan."] = function () {
    var queryable = new _Queryable2.default({ type: "table" }).column("columnName").isLessThan(0);
    var selectStatementCreator = new _SelectStatementCreator2.default(queryable);

    var _selectStatementCreat8 = selectStatementCreator.createStatement(),
        sql = _selectStatementCreat8.sql;

    var expected = "SELECT * FROM \"table\" WHERE \"columnName\" < 0 LIMIT -1 OFFSET 0";

    assert.equal(sql, expected);
};

exports["SelectStatementCreator: isLessThanOrEqualTo."] = function () {
    var queryable = new _Queryable2.default({ type: "table" }).column("columnName").isLessThanOrEqualTo(0);
    var selectStatementCreator = new _SelectStatementCreator2.default(queryable);

    var _selectStatementCreat9 = selectStatementCreator.createStatement(),
        sql = _selectStatementCreat9.sql;

    var expected = "SELECT * FROM \"table\" WHERE \"columnName\" <= 0 LIMIT -1 OFFSET 0";

    assert.equal(sql, expected);
};

exports["SelectStatementCreator: isIn with array."] = function () {
    var queryable = new _Queryable2.default({ type: "table" }).column("columnName").isIn(["John", "Jane"]);
    var selectStatementCreator = new _SelectStatementCreator2.default(queryable);

    var _selectStatementCreat10 = selectStatementCreator.createStatement(),
        sql = _selectStatementCreat10.sql;

    var expected = "SELECT * FROM \"table\" WHERE \"columnName\" IN ('John', 'Jane') LIMIT -1 OFFSET 0";

    assert.equal(sql, expected);
};

exports["SelectStatementCreator: isNotIn with array."] = function () {
    var queryable = new _Queryable2.default({ type: "table" }).column("columnName").isNotIn(["John", "Jane"]);
    var selectStatementCreator = new _SelectStatementCreator2.default(queryable);

    var _selectStatementCreat11 = selectStatementCreator.createStatement(),
        sql = _selectStatementCreat11.sql;

    var expected = "SELECT * FROM \"table\" WHERE \"columnName\" NOT IN ('John', 'Jane') LIMIT -1 OFFSET 0";

    assert.equal(sql, expected);
};

exports["SelectStatementCreator: isIn with queryable."] = function () {
    var queryable = new _Queryable2.default({ type: "other_table" }).select({ id: "id" });
    var rootQueryable = new _Queryable2.default({ type: "table" }).column("columnName").isIn(queryable);
    var selectStatementCreator = new _SelectStatementCreator2.default(rootQueryable);

    var _selectStatementCreat12 = selectStatementCreator.createStatement(),
        sql = _selectStatementCreat12.sql;

    var expected = "SELECT * FROM \"table\" WHERE \"columnName\" IN (SELECT id AS id FROM \"other_table\" LIMIT -1 OFFSET 0) LIMIT -1 OFFSET 0";

    assert.equal(sql, expected);
};

exports["SelectStatementCreator: isNotIn with queryable."] = function () {
    var queryable = new _Queryable2.default({ type: "other_table" }).select({ id: "id" });
    var rootQueryable = new _Queryable2.default({ type: "table" }).column("columnName").isNotIn(queryable);
    var selectStatementCreator = new _SelectStatementCreator2.default(rootQueryable);

    var _selectStatementCreat13 = selectStatementCreator.createStatement(),
        sql = _selectStatementCreat13.sql;

    var expected = "SELECT * FROM \"table\" WHERE \"columnName\" NOT IN (SELECT id AS id FROM \"other_table\" LIMIT -1 OFFSET 0) LIMIT -1 OFFSET 0";

    assert.equal(sql, expected);
};
//# sourceMappingURL=SelectStatementCreator.js.map