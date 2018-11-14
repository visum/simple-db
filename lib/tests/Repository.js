"use strict";

var _assert = require("assert");

var assert = _interopRequireWildcard(_assert);

var _sqlite = require("sqlite3");

var _sqlite2 = _interopRequireDefault(_sqlite);

var _Repository = require("../sqlite/Repository");

var _Repository2 = _interopRequireDefault(_Repository);

var _person = require("../testSchemas/person");

var _person2 = _interopRequireDefault(_person);

var _TableCreator = require("../sqlite/TableCreator");

var _TableCreator2 = _interopRequireDefault(_TableCreator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports["Repository: addAsync"] = function () {
    var database = new _sqlite2.default.Database(":memory:");
    var repository = new _Repository2.default({
        database: database,
        schema: _person2.default
    });

    return _TableCreator2.default.createTableIfNotExistsAsync({
        database: database,
        schema: _person2.default
    }).then(function () {
        return repository.addAsync({ firstName: "John" });
    }).then(function () {
        database.close();
    }).catch(function (error) {
        database.close();
        throw error;
    });
};

exports["Repository: updateAsync"] = function () {
    var database = new _sqlite2.default.Database(":memory:");
    var repository = new _Repository2.default({
        database: database,
        schema: _person2.default
    });

    return _TableCreator2.default.createTableIfNotExistsAsync({
        database: database,
        schema: _person2.default
    }).then(function () {
        return repository.addAsync({ firstName: "John" });
    }).then(function (_ref) {
        var id = _ref.lastID;

        return repository.updateAsync({
            id: id,
            firstName: "Jane"
        });
    }).then(function () {
        return repository.where().column("firstName").isEqualTo("Jane").toArrayAsync();
    }).then(function (results) {
        assert.equal(results.length, 1);
        database.close();
    }).catch(function (error) {
        database.close();
        throw error;
    });
};

exports["Repository: removeAsync"] = function () {
    var database = new _sqlite2.default.Database(":memory:");
    var repository = new _Repository2.default({
        database: database,
        schema: _person2.default
    });

    return _TableCreator2.default.createTableIfNotExistsAsync({
        database: database,
        schema: _person2.default
    }).then(function () {
        return repository.addAsync({ firstName: "John" });
    }).then(function (_ref2) {
        var id = _ref2.lastID;

        return repository.removeAsync({
            id: id
        });
    }).then(function () {
        return repository.where().column("firstName").isEqualTo("John").toArrayAsync();
    }).then(function (results) {
        assert.equal(results.length, 0);
        database.close();
    }).catch(function (error) {
        database.close();
        throw error;
    });
};
//# sourceMappingURL=Repository.js.map