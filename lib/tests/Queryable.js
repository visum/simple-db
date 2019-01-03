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

var createDatabaseAsync = function createDatabaseAsync(database) {
    return _TableCreator2.default.createTableIfNotExistsAsync({
        database: database,
        schema: _person2.default
    });
};

var fillDatabaseAsync = function fillDatabaseAsync(table) {
    var tests = [];

    for (var x = 0; x < 300; x++) {
        var testsPromise = table.addAsync({
            firstName: "John_" + x + "_"
        });
        tests.push(testsPromise);
    }

    return Promise.all(tests);
};

exports["Queryable: toArrayAsync."] = function () {
    var database = new _sqlite2.default.Database(":memory:");
    var createDatabasePromise = createDatabaseAsync(database);
    var table = new _Repository2.default({
        database: database,
        schema: _person2.default
    });

    return createDatabasePromise.then(function () {
        return fillDatabaseAsync(table);
    }).then(function () {
        return table.where().column("firstName").endsWith("ohn_1_").or().column("firstName").startsWith("John_2_").and().column("firstName").contains("John").orderByDesc("id").toArrayAsync();
    }).then(function (results) {
        assert.equal(results.length, 2);

        return table.where().column("firstName").contains("John").removeAsync();
    }).then(function () {
        return table.where().toArrayAsync();
    }).then(function (results) {
        assert.equal(results.length, 0);
        database.close();
    }).catch(function (error) {
        database.close();
        throw error;
    });
};

exports["Queryable: IsIn with Queryable."] = function () {
    var database = new _sqlite2.default.Database(":memory:");
    var createDatabasePromise = createDatabaseAsync(database);
    var table = new _Repository2.default({
        database: database,
        schema: _person2.default
    });

    return createDatabasePromise.then(function () {
        return fillDatabaseAsync(table);
    }).then(function () {
        return table.where().column("firstName").isIn(table.where().select({ "firstName": "firstName" }).take(1)).toArrayAsync();
    }).then(function (results) {
        assert.equal(results.length, 1);
        database.close();
    }).catch(function (error) {
        database.close();
        throw error;
    });
};

exports["Queryable: IsIn with Array."] = function () {
    var database = new _sqlite2.default.Database(":memory:");
    var createDatabasePromise = createDatabaseAsync(database);
    var table = new _Repository2.default({
        database: database,
        schema: _person2.default
    });

    return createDatabasePromise.then(function () {
        return fillDatabaseAsync(table);
    }).then(function () {
        return table.where().column("firstName").isIn(["John_1_"]).toArrayAsync();
    }).then(function (results) {
        assert.equal(results.length, 1);
        database.close();
    }).catch(function (error) {
        database.close();
        throw error;
    });
};

exports["Queryable: getFirstAsync"] = function () {
    var database = new _sqlite2.default.Database(":memory:");
    var createDatabasePromise = createDatabaseAsync(database);
    var table = new _Repository2.default({
        database: database,
        schema: _person2.default
    });

    return createDatabasePromise.then(function () {
        return fillDatabaseAsync(table);
    }).then(function () {
        return table.where().column("firstName").endsWith("_1_").getFirstAsync();
    }).then(function (result) {
        assert.equal(result != null, true);
        database.close();
    }).catch(function (error) {
        database.close();
        throw error;
    });
};

exports["Queryable: removeAsync"] = function () {
    var database = new _sqlite2.default.Database(":memory:");
    var createDatabasePromise = createDatabaseAsync(database);
    var table = new _Repository2.default({
        database: database,
        schema: _person2.default
    });

    return createDatabasePromise.then(function () {
        return fillDatabaseAsync(table);
    }).then(function () {
        return table.where().column("firstName").contains("John").removeAsync();
    }).then(function () {
        return table.where().toArrayAsync();
    }).then(function (results) {
        assert.equal(results.length, 0);
        database.close();
    }).catch(function (error) {
        database.close();
        throw error;
    });
};

exports["Queryable: updateAsync"] = function () {
    var database = new _sqlite2.default.Database(":memory:");
    var createDatabasePromise = createDatabaseAsync(database);
    var table = new _Repository2.default({
        database: database,
        schema: _person2.default
    });

    return createDatabasePromise.then(function () {
        return fillDatabaseAsync(table);
    }).then(function () {
        return table.where().column("firstName").endsWith("hn_1_").updateAsync({
            firstName: "Jane"
        });
    }).then(function () {
        return table.where().column("firstName").endsWith("Jane").toArrayAsync();
    }).then(function (results) {
        assert.equal(results[0].firstName, "Jane");
        database.close();
    }).catch(function (error) {
        database.close();
        throw error;
    });
};

exports["Queryable: getCountAsync"] = function () {
    var database = new _sqlite2.default.Database(":memory:");
    var createDatabasePromise = createDatabaseAsync(database);
    var table = new _Repository2.default({
        database: database,
        schema: _person2.default
    });

    return createDatabasePromise.then(function () {
        return fillDatabaseAsync(table);
    }).then(function () {
        return table.where().column("firstName").contains("John").getCountAsync();
    }).then(function (count) {
        assert.equal(count, 300);
    }).catch(function (error) {
        database.close();
        throw error;
    });
};
//# sourceMappingURL=Queryable.js.map