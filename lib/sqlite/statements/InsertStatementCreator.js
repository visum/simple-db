"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SqliteUtils = require("../utils/SqliteUtils");

var _SqliteUtils2 = _interopRequireDefault(_SqliteUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InsertStatementCreator = function () {
    function InsertStatementCreator(_ref) {
        var entity = _ref.entity,
            tableName = _ref.tableName,
            primaryKeys = _ref.primaryKeys;

        _classCallCheck(this, InsertStatementCreator);

        this.entity = entity;
        this.tableName = tableName;
        this.primaryKeys = primaryKeys;
    }

    _createClass(InsertStatementCreator, [{
        key: "createStatement",
        value: function createStatement() {
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
    }], [{
        key: "createStatement",
        value: function createStatement(options) {
            var insertStatementCreator = new InsertStatementCreator(options);
            return insertStatementCreator.createStatement();
        }
    }]);

    return InsertStatementCreator;
}();

exports.default = InsertStatementCreator;
//# sourceMappingURL=InsertStatementCreator.js.map