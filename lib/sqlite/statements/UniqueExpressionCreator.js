"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SqliteUtils = require("../utils/SqliteUtils");

var _SqliteUtils2 = _interopRequireDefault(_SqliteUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UniqueExpressionCreator = function () {
    function UniqueExpressionCreator(unique) {
        _classCallCheck(this, UniqueExpressionCreator);

        this.unique = unique || { columns: [], conflictOption: null };
    }

    _createClass(UniqueExpressionCreator, [{
        key: "createConflictResolution",
        value: function createConflictResolution() {
            if (this.unique.conflictOption == null) {
                return "";
            }
            return this.unique.conflictOption;
        }
    }, {
        key: "createUniqueExpression",
        value: function createUniqueExpression() {
            var columns = this.unique.columns.map(function (column) {
                return _SqliteUtils2.default.escapeName(column);
            });

            return "UNIQUE (" + columns + ")";
        }
    }, {
        key: "createExpression",
        value: function createExpression() {
            var expression = [];
            var uniqueExpression = this.createUniqueExpression();
            var conflictOptions = this.createConflictResolution();

            expression.push(uniqueExpression);

            if (conflictOptions != "") {
                expression.push("ON CONFLICT " + conflictOptions);
            }

            return expression.join(" ");
        }
    }]);

    return UniqueExpressionCreator;
}();

exports.default = UniqueExpressionCreator;
//# sourceMappingURL=UniqueExpressionCreator.js.map