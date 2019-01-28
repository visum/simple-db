"use strict";

var _assert = require("assert");

var assert = _interopRequireWildcard(_assert);

var _sqlite = require("sqlite3");

var _sqlite2 = _interopRequireDefault(_sqlite);

var _Table = require("../sqlite/Table");

var _Table2 = _interopRequireDefault(_Table);

var _person = require("../testSchemas/person");

var _person2 = _interopRequireDefault(_person);

var _TableCreator = require("../sqlite/TableCreator");

var _TableCreator2 = _interopRequireDefault(_TableCreator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports["Table: addAsync"] = function () {
    var database = new _sqlite2.default.Database(":memory:");
    var table = new _Table2.default({
        database: database,
        schema: _person2.default
    });

    return _TableCreator2.default.createTableIfNotExistsAsync({
        database: database,
        schema: _person2.default
    }).then(function () {
        return table.addAsync({ firstName: "John" });
    }).then(function () {
        database.close();
    }).catch(function (error) {
        database.close();
        throw error;
    });
};

exports["Table: updateAsync"] = function () {
    var database = new _sqlite2.default.Database(":memory:");
    var table = new _Table2.default({
        database: database,
        schema: _person2.default
    });

    return _TableCreator2.default.createTableIfNotExistsAsync({
        database: database,
        schema: _person2.default
    }).then(function () {
        return table.addAsync({ firstName: "John" });
    }).then(function (_ref) {
        var id = _ref.lastID;

        return table.updateAsync({
            id: id,
            firstName: "Jane"
        });
    }).then(function () {
        return table.where().column("firstName").isEqualTo("Jane").toArrayAsync();
    }).then(function (results) {
        assert.equal(results.length, 1);
        database.close();
    }).catch(function (error) {
        database.close();
        throw error;
    });
};

exports["Table: removeAsync"] = function () {
    var database = new _sqlite2.default.Database(":memory:");
    var table = new _Table2.default({
        database: database,
        schema: _person2.default
    });

    return _TableCreator2.default.createTableIfNotExistsAsync({
        database: database,
        schema: _person2.default
    }).then(function () {
        return table.addAsync({ firstName: "John" });
    }).then(function (_ref2) {
        var id = _ref2.lastID;

        return table.removeAsync({
            id: id
        });
    }).then(function () {
        return table.where().column("firstName").isEqualTo("John").toArrayAsync();
    }).then(function (results) {
        assert.equal(results.length, 0);
        database.close();
    }).catch(function (error) {
        database.close();
        throw error;
    });
};
//# sourceMappingURL=Table.js.map