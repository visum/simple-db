"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SqliteUtils = require("../utils/SqliteUtils");

var _SqliteUtils2 = _interopRequireDefault(_SqliteUtils);

var _AbstractStatementCreator = require("./AbstractStatementCreator");

var _AbstractStatementCreator2 = _interopRequireDefault(_AbstractStatementCreator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DeleteStatementCreator = function (_AbstractStatementCre) {
    _inherits(DeleteStatementCreator, _AbstractStatementCre);

    function DeleteStatementCreator() {
        _classCallCheck(this, DeleteStatementCreator);

        return _possibleConstructorReturn(this, (DeleteStatementCreator.__proto__ || Object.getPrototypeOf(DeleteStatementCreator)).apply(this, arguments));
    }

    _createClass(DeleteStatementCreator, [{
        key: "createStatement",
        value: function createStatement() {
            var entity = this.entity;

            if (!this.validateEntityPrimaryKeys(entity)) {
                throw new Error("Cannot delete entity: Invalid primary key(s).");
            }

            var whereStatement = this.createWhereExpression(entity);

            return {
                sql: "DELETE FROM " + _SqliteUtils2.default.escapeName(this.tableName) + " " + whereStatement,
                values: []
            };
        }
    }], [{
        key: "createStatement",
        value: function createStatement(options) {
            var deleteStatementCreator = new DeleteStatementCreator(options);
            return deleteStatementCreator.createStatement();
        }
    }]);

    return DeleteStatementCreator;
}(_AbstractStatementCreator2.default);

exports.default = DeleteStatementCreator;
//# sourceMappingURL=DeleteStatementCreator.js.map