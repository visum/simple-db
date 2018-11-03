"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SqliteUtils = require("../utils/SqliteUtils");

var _SqliteUtils2 = _interopRequireDefault(_SqliteUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EntityToSqlFactory = function () {
    function EntityToSqlFactory(_ref) {
        var entity = _ref.entity,
            tableName = _ref.tableName,
            primaryKeys = _ref.primaryKeys;

        _classCallCheck(this, EntityToSqlFactory);

        if (!Array.isArray(primaryKeys) || primaryKeys.length === 0) {
            throw new Error("Invalid Argument Exception:'primaryKeys' needs to be an array of length greater than 0. ");
        }

        this.tableName = tableName;
        this.entity = entity;
        this.primaryKeys = primaryKeys;
    }

    _createClass(EntityToSqlFactory, [{
        key: "validateEntityPrimaryKeys",
        value: function validateEntityPrimaryKeys(entity) {
            if (this.primaryKeys.length === 1) {
                return entity[this.primaryKeys[0]] != null;
            } else if (this.primaryKeys.length > 1) {
                return this.primaryKeys.every(function (key) {
                    return typeof entity[key] !== "undefined";
                });
            } else {
                return false;
            }
        }
    }, {
        key: "createWhereStatement",
        value: function createWhereStatement(entity) {
            var columns = this.primaryKeys.map(function (key) {
                return _SqliteUtils2.default.escapeName(key) + " = " + _SqliteUtils2.default.escapeStringValue(entity[key]);
            }).join(", ");

            return "WHERE " + columns;
        }
    }, {
        key: "createInsertStatement",
        value: function createInsertStatement() {
            var entity = this.entity;
            var keys = Object.keys(entity);
            var values = keys.map(function (key) {
                return entity[key];
            });
            var escapedKeys = keys.map(function (key) {
                return _SqliteUtils2.default.escapeName(key);
            });

            var placeHolderArray = new Array(keys.length).fill("?").join(", ");

            return {
                sql: "INSERT INTO " + _SqliteUtils2.default.escapeName(this.tableName) + " ( " + escapedKeys.join(", ") + " ) VALUES ( " + placeHolderArray + " )",
                values: values
            };
        }
    }, {
        key: "createUpdateStatement",
        value: function createUpdateStatement() {
            var _this = this;

            var entity = this.entity;
            var keys = Object.keys(entity);

            if (!this.validateEntityPrimaryKeys(entity)) {
                throw new Error("Cannot update entity: Invalid primary key(s).");
            }

            var sqliteData = keys.reduce(function (accumulator, key) {
                if (_this.primaryKeys.includes(key)) {
                    return accumulator;
                }

                accumulator.placeHolderValues.push(_SqliteUtils2.default.escapeName(key) + " = ?");
                accumulator.values.push(entity[key]);
                return accumulator;
            }, { placeHolderValues: [], values: [] });

            var whereStatement = this.createWhereStatement(entity);

            return {
                sql: "UPDATE " + _SqliteUtils2.default.escapeName(this.tableName) + " SET " + sqliteData.placeHolderValues.join(", ") + " " + whereStatement,
                values: sqliteData.values
            };
        }
    }, {
        key: "createDeleteStatement",
        value: function createDeleteStatement() {
            var entity = this.entity;

            if (!this.validateEntityPrimaryKeys(entity)) {
                throw new Error("Cannot delete entity: Invalid primary key(s).");
            }

            var whereStatement = this.createWhereStatement(entity);

            return {
                sql: "DELETE FROM " + _SqliteUtils2.default.escapeName(this.tableName) + " " + whereStatement,
                values: []
            };
        }
    }]);

    return EntityToSqlFactory;
}();

exports.default = EntityToSqlFactory;
//# sourceMappingURL=EntityToSqlFactory.js.map