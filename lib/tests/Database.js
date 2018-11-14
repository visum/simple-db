"use strict";

var _assert = require("assert");

var assert = _interopRequireWildcard(_assert);

var _Database = require("../sqlite/Database");

var _Database2 = _interopRequireDefault(_Database);

var _sqlite = require("sqlite3");

var _sqlite2 = _interopRequireDefault(_sqlite);

var _person = require("../testSchemas/person");

var _person2 = _interopRequireDefault(_person);

var _address = require("../testSchemas/address");

var _address2 = _interopRequireDefault(_address);

var _phoneNumber = require("../testSchemas/phoneNumber");

var _phoneNumber2 = _interopRequireDefault(_phoneNumber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports["Database: Add Schemas."] = function () {
    var database = new _Database2.default({ database: new _sqlite2.default.Database(":memory:") });

    database.addSchema(_person2.default);
    database.addSchema(_address2.default);
    database.addSchema(_phoneNumber2.default);
};

exports["Database: Add Person."] = function () {
    var database = new _Database2.default({ database: new _sqlite2.default.Database(":memory:") });

    database.addSchema(_person2.default);

    return database.createTablesFromSchemasAsync().then(function () {
        return database.getRepository(_person2.default.name, _person2.default.version).addAsync({
            firstName: "John",
            lastName: "Doe"
        });
    });
};
//# sourceMappingURL=Database.js.map