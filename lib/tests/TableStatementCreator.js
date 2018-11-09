"use strict";

var _assert = require("assert");

var assert = _interopRequireWildcard(_assert);

var _TableStatementCreator = require("../sqlite/statements/TableStatementCreator");

var _TableStatementCreator2 = _interopRequireDefault(_TableStatementCreator);

var _person = require("../testSchemas/person");

var _person2 = _interopRequireDefault(_person);

var _address = require("../testSchemas/address");

var _address2 = _interopRequireDefault(_address);

var _phoneNumber = require("../testSchemas/phoneNumber");

var _phoneNumber2 = _interopRequireDefault(_phoneNumber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports["SchemaToSqliteFactory: Person Schema."] = function () {
    var schemaToSqliteFactory = new _TableStatementCreator2.default(_person2.default);
    var createTableStatement = schemaToSqliteFactory.createTableStatement();
    var expectedSql = "CREATE TABLE IF NOT EXISTS \"person_0.0.1\" (\"id\" INTEGER, \"firstName\" TEXT, \"lastName\" TEXT, \"dateOfBirth\" INTEGER, PRIMARY KEY(\"id\"))";

    assert.equal(createTableStatement.sql, expectedSql);
};

exports["SchemaToSqliteFactory: Address Schema."] = function () {
    var schemaToSqliteFactory = new _TableStatementCreator2.default(_address2.default);
    var createTableStatement = schemaToSqliteFactory.createTableStatement();
    var expectedSql = "CREATE TABLE IF NOT EXISTS \"address_0.0.1\" (\"id\" INTEGER, \"address\" TEXT, \"city\" TEXT, \"state\" INTEGER, \"zipCode\" INTEGER, \"personId\" INTEGER NOT NULL, PRIMARY KEY(\"id\"), FOREIGN KEY (\"personId\") REFERENCES \"person_0.0.1\" (\"id\"))";

    assert.equal(createTableStatement.sql, expectedSql);
};

exports["SchemaToSqliteFactory: Phone Number Schema."] = function () {
    var schemaToSqliteFactory = new _TableStatementCreator2.default(_phoneNumber2.default);
    var createTableStatement = schemaToSqliteFactory.createTableStatement();
    var expectedSql = "CREATE TABLE IF NOT EXISTS \"address_0.0.1\" (\"id\" INTEGER, \"type\" TEXT, \"personId\" INTEGER NOT NULL, PRIMARY KEY(\"id\"), UNIQUE (\"personId\",\"type\"), FOREIGN KEY (\"personId\") REFERENCES \"person_0.0.1\" (\"id\"))";

    assert.equal(createTableStatement.sql, expectedSql);
};
//# sourceMappingURL=TableStatementCreator.js.map