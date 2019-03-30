"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _PostgreSQLUtils = _interopRequireDefault(require("../utils/PostgreSQLUtils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UniqueExpressionCreator {
  constructor(unique) {
    this.unique = unique || {
      columns: [],
      conflictOption: null
    };
  }

  createConflictResolution() {
    if (this.unique.conflictOption == null) {
      return "";
    }

    return this.unique.conflictOption;
  }

  createUniqueExpression() {
    const columns = this.unique.columns.map(column => {
      return _PostgreSQLUtils.default.escapeName(column);
    });
    return `UNIQUE (${columns})`;
  }

  createExpression() {
    const expression = [];
    const uniqueExpression = this.createUniqueExpression();
    const conflictOptions = this.createConflictResolution();
    expression.push(uniqueExpression);

    if (conflictOptions != "") {
      expression.push(`ON CONFLICT ${conflictOptions}`);
    }

    return expression.join(" ");
  }

}

exports.default = UniqueExpressionCreator;
//# sourceMappingURL=UniqueExpressionCreator.js.map