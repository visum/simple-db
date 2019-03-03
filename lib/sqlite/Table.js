"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Provider = require("./Provider");

var _Provider2 = _interopRequireDefault(_Provider);

var _Queryable = require("../queryable/Queryable");

var _Queryable2 = _interopRequireDefault(_Queryable);

var _Sqlite3Wrapper = require("./Sqlite3Wrapper");

var _Sqlite3Wrapper2 = _interopRequireDefault(_Sqlite3Wrapper);

var _InsertStatementCreator = require("./statements/InsertStatementCreator");

var _InsertStatementCreator2 = _interopRequireDefault(_InsertStatementCreator);

var _UpdateStatementCreator = require("./statements/UpdateStatementCreator");

var _UpdateStatementCreator2 = _interopRequireDefault(_UpdateStatementCreator);

var _DeleteStatementCreator = require("./statements/DeleteStatementCreator");

var _DeleteStatementCreator2 = _interopRequireDefault(_DeleteStatementCreator);

var _SchemaUtils = require("./utils/SchemaUtils");

var _SchemaUtils2 = _interopRequireDefault(_SchemaUtils);

var _invokeMethodAsync = require("./utils/invokeMethodAsync");

var _invokeMethodAsync2 = _interopRequireDefault(_invokeMethodAsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Table = function () {
    function Table(_ref) {
        var database = _ref.database,
            schema = _ref.schema,
            lifeCycleDelegate = _ref.lifeCycleDelegate;

        _classCallCheck(this, Table);

        if (lifeCycleDelegate == null || (typeof lifeCycleDelegate === "undefined" ? "undefined" : _typeof(lifeCycleDelegate)) !== "object") {
            lifeCycleDelegate = {};
        }

        this.name = _SchemaUtils2.default.getTableNameFromSchema(schema);
        this.database = database;
        this.sqliteDatabaseWrapper = new _Sqlite3Wrapper2.default(this.database);
        this.primaryKeys = schema.primaryKeys;
        this.lifeCycleDelegate = lifeCycleDelegate;
    }

    _createClass(Table, [{
        key: "addAsync",
        value: function addAsync(entity) {
            var _this = this;

            var response = void 0;

            return (0, _invokeMethodAsync2.default)(this.lifeCycleDelegate, "canEntityBeAddedAsync", [entity], true).then(function () {
                return (0, _invokeMethodAsync2.default)(_this.lifeCycleDelegate, "prepareEntityToBeAddedAsync", [entity], entity);
            }).then(function (entity) {
                var _InsertStatementCreat = _InsertStatementCreator2.default.createStatement({
                    tableName: _this.name,
                    entity: entity,
                    primaryKeys: _this.primaryKeys
                }),
                    sql = _InsertStatementCreat.sql,
                    values = _InsertStatementCreat.values;

                return _this.sqliteDatabaseWrapper.runAsync(sql, values);
            }).then(function (result) {
                response = result;

                return (0, _invokeMethodAsync2.default)(_this.lifeCycleDelegate, "entityAddedAsync", [entity, result], result).catch(function (error) {
                    // Swallow errors.
                });
            }).then(function () {
                return response;
            });
        }
    }, {
        key: "removeAsync",
        value: function removeAsync(entity) {
            var _this2 = this;

            var response = void 0;

            return (0, _invokeMethodAsync2.default)(this.lifeCycleDelegate, "canEntityBeRemovedAsync", [entity], true).then(function () {
                return (0, _invokeMethodAsync2.default)(_this2.lifeCycleDelegate, "prepareEntityToBeRemovedAsync", [entity], entity);
            }).then(function (entity) {
                var _DeleteStatementCreat = _DeleteStatementCreator2.default.createStatement({
                    tableName: _this2.name,
                    entity: entity,
                    primaryKeys: _this2.primaryKeys
                }),
                    sql = _DeleteStatementCreat.sql,
                    values = _DeleteStatementCreat.values;

                return _this2.sqliteDatabaseWrapper.runAsync(sql, values);
            }).then(function (result) {
                response = result;

                return (0, _invokeMethodAsync2.default)(_this2.lifeCycleDelegate, "entityRemovedAsync", [entity, result], result).catch(function (error) {
                    // Swallow errors.
                });
            }).then(function () {
                return response;
            });
        }
    }, {
        key: "updateAsync",
        value: function updateAsync(entity) {
            var _this3 = this;

            var response = void 0;

            return (0, _invokeMethodAsync2.default)(this.lifeCycleDelegate, "canEntityBeUpdatedAsync", [entity], true).then(function () {
                return (0, _invokeMethodAsync2.default)(_this3.lifeCycleDelegate, "prepareEntityToBeUpdatedAsync", [entity], entity);
            }).then(function (entity) {
                var _UpdateStatementCreat = _UpdateStatementCreator2.default.createStatement({
                    tableName: _this3.name,
                    entity: entity,
                    primaryKeys: _this3.primaryKeys
                }),
                    sql = _UpdateStatementCreat.sql,
                    values = _UpdateStatementCreat.values;

                return _this3.sqliteDatabaseWrapper.runAsync(sql, values);
            }).then(function (result) {
                response = result;

                return (0, _invokeMethodAsync2.default)(_this3.lifeCycleDelegate, "entityUpdatedAsync", [entity, result], result).catch(function (error) {
                    // Swallow errors.
                });
            }).then(function () {
                return response;
            });
        }
    }, {
        key: "getQueryProvider",
        value: function getQueryProvider() {
            return new _Provider2.default({
                database: this.database,
                refineQueryable: this.lifeCycleDelegate.refineQueryable
            });
        }
    }, {
        key: "where",
        value: function where() {
            var provider = this.getQueryProvider();

            return new _Queryable2.default({
                query: {
                    type: this.name,
                    expression: null,
                    select: {},
                    limit: -1,
                    offset: 0,
                    orderBy: []
                },
                provider: provider
            });
        }
    }]);

    return Table;
}();

exports.default = Table;
//# sourceMappingURL=Table.js.map