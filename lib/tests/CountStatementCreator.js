"use strict";

var _assert = require("assert");

var assert = _interopRequireWildcard(_assert);

var _CountStatementCreator = require("../sqlite/statements/CountStatementCreator");

var _CountStatementCreator2 = _interopRequireDefault(_CountStatementCreator);

var _Queryable = require("../queryable/Queryable");

var _Queryable2 = _interopRequireDefault(_Queryable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports["CountStatementCreator: IsEqualTo"] = function () {
    var queryable = new _Queryable2.default({ type: "table" }).column("columnName").isEqualTo("value");
    var countStatementCreator = new _CountStatementCreator2.default(queryable);
    var result = countStatementCreator.createStatement();
    var expected = "SELECT count(*) FROM \"table\" WHERE \"columnName\" = 'value'";

    assert.equal(result, expected);
};

exports["CountStatementCreator: Empty"] = function () {
    var queryable = new _Queryable2.default({ type: "table" });
    var countStatementCreator = new _CountStatementCreator2.default(queryable);
    var result = countStatementCreator.createStatement();
    var expected = "SELECT count(*) FROM \"table\"";

    assert.equal(result, expected);
};
//# sourceMappingURL=CountStatementCreator.js.map