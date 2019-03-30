"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Visitor = _interopRequireDefault(require("./Visitor"));

var _SelectStatementCreator = _interopRequireDefault(require("../statements/SelectStatementCreator"));

var _PostgreSQLUtils = _interopRequireDefault(require("../utils/PostgreSQLUtils"));

var _Queryable = _interopRequireDefault(require("../../queryable/Queryable"));

var _SqlString = _interopRequireDefault(require("./SqlString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SqlVisitor extends _Visitor.default {
  and(...args) {
    if (args.length === 0) {
      return "";
    }

    return `(${args.join(" AND ")})`;
  }

  or(...args) {
    if (args.length === 0) {
      return "";
    }

    return `(${args.join(" OR ")})`;
  }

  endsWith(property, value) {
    return `${property} LIKE ${value.toEndsWithString()}`;
  }

  startsWith(property, value) {
    return `${property} LIKE ${value.toStartsWithString()}`;
  }

  contains(property, value) {
    return `${property} LIKE ${value.toContainsString()}`;
  }

  isEqualTo(property, value) {
    return `${property} = ${value.toString()}`;
  }

  isNotEqualTo(property, value) {
    return `${property} != ${value.toString()}`;
  }

  isGreaterThan(property, value) {
    return `${property} > ${value.toString()}`;
  }

  isGreaterThanOrEqualTo(property, value) {
    return `${property} >= ${value.toString()}`;
  }

  isLessThan(property, value) {
    return `${property} < ${value.toString()}`;
  }

  isLessThanOrEqualTo(property, value) {
    return `${property} <= ${value.toString()}`;
  }

  isIn(property, value) {
    return `${property} IN ${value}`;
  }

  isNotIn(property, value) {
    return `${property} NOT IN ${value}`;
  }

  queryable(value) {
    const queryable = _Queryable.default.fromObject(value);

    const selectStatementCreator = new _SelectStatementCreator.default(queryable);
    const {
      sql
    } = selectStatementCreator.createStatement();
    return `(${sql})`;
  }

  string(value) {
    if (typeof value !== "string") {
      throw new Error("Invalid string value.");
    }

    return new _SqlString.default(value);
  }

  boolean(value) {
    if (typeof value !== "boolean") {
      throw new Error("Invalid boolean value.");
    }

    return value.toString();
  }

  number(value) {
    if (typeof value !== "number") {
      throw new Error("Invalid number value.");
    }

    return value;
  }

  date(value) {
    if (!(value instanceof value)) {
      throw new Error("Invalid date value.");
    }

    return value.getTime();
  }

  array(value) {
    if (!Array.isArray(value)) {
      throw new Error("Invalid array value.");
    }

    const series = value.map(item => {
      if (typeof item === "string") {
        return this.string(item).toString();
      } else if (typeof item === "number") {
        return this.number(item);
      } else if (typeof item === "boolean") {
        return this.boolean(item);
      } else if (item instanceof Date) {
        return this.date(item);
      } else {
        throw new Error("Invalid Argument: Unknown primitive type.");
      }
    }).join(", ");
    return `(${series})`;
  }

  propertyName(name) {
    return _PostgreSQLUtils.default.escapeName(name);
  }

  property(type, name) {
    return name;
  }

  type(value) {
    this.table = value;
    return value;
  }

  createWhereExpression(node) {
    const where = this.visit(node);

    if (where == null) {
      return "";
    }

    return `WHERE ${where}`;
  }

}

exports.default = SqlVisitor;
//# sourceMappingURL=SqlVisitor.js.map